import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const dotenv = require('dotenv');
const diff = require('diff');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Utility function to clean strings
function cleanString(str) {
  // Simple implementation - enhance as needed
  return str.trim();
}

/**
 * Generates Solidity modifiers and inserts them into a template file
 */
function generateModifier(policyS, outputFileName) {
  const functionNames = [];
  const policySyntax = JSON.parse(policyS);
  
  let iter = 0;
  let count = 0;
  const countArray = [];
  
  for (const rule of policySyntax.RulesJSON) {
    if (!countArray.includes(rule.functionSignature)) {
      count += 1;
      countArray.push(rule.functionSignature);
    }
  }
  
  // Read the template file
  const templatePath = path.join(__dirname, 'node_modules/@thrackle-io/forte-rules-engine-sdk/src/codeGeneration/Template.sol');
  let overallModifiedData = '';
  
  // If template doesn't exist, create a basic one
  if (!fs.existsSync(templatePath)) {
    overallModifiedData = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract RulesEngineClientCustom {
    function _invokeRulesEngine(bytes memory data) internal virtual;
    
    // Modifier Here
}
`;
  } else {
    overallModifiedData = fs.readFileSync(templatePath, 'utf-8');
  }
  
  if (!fs.existsSync(path.dirname(outputFileName))) {
    fs.mkdirSync(path.dirname(outputFileName), { recursive: true });
  }
  
  for (const syntax of policySyntax.RulesJSON) {
    const argList = syntax.encodedValues;
    const signatureName = syntax.functionSignature.split('(')[0];
    
    if (functionNames.includes(signatureName)) {
      continue;
    } else {
      functionNames.push(signatureName);
      
      let modifierNameStr = 'modifier checkRulesBefore' + signatureName + '([]) {\n';
      let modifierNameAfterStr = '\tmodifier checkRulesAfter' + signatureName + '([]) {\n';
      
      let argListUpdate = argList.replace(/address /g, '');
      argListUpdate = argListUpdate.replace(/uint256 /g, '');
      argListUpdate = argListUpdate.replace(/string /g, '');
      argListUpdate = argListUpdate.replace(/bool /g, '');
      argListUpdate = argListUpdate.replace(/bytes /g, '');
      
      modifierNameStr = modifierNameStr.replace('[]', argList.trim());
      modifierNameAfterStr = modifierNameAfterStr.replace('[]', argList.trim());
      
      let encodeStr = '\t\tbytes memory encoded = abi.encodeWithSelector(msg.sig,[]);\n';
      encodeStr = encodeStr.replace('[]', argListUpdate);
      
      const thirdLine = '\t\t_invokeRulesEngine(encoded);\n';
      const fourthLine = '\t\t_;\n';
      const finalLine = '\t}';
      
      const outputString = modifierNameStr + encodeStr + thirdLine + fourthLine + finalLine;
      const outputStringTwo = modifierNameAfterStr + encodeStr + fourthLine + thirdLine + finalLine;
      
      let replaceStr = outputString + '\n\n' + outputStringTwo;
      
      iter += 1;
      if (iter < count) {
        replaceStr += '\n\n';
        replaceStr += '\t// Modifier Here';
        replaceStr += '\n';
      }
      
      const modifiedData = overallModifiedData.replace('// Modifier Here', replaceStr);
      overallModifiedData = modifiedData;
    }
  }
  
  // Write the modified data back to the file
  fs.writeFileSync(outputFileName, overallModifiedData, 'utf-8');
}

/**
 * Injects a modifier into a Solidity contract file
 */
function injectModifier(funcName, variables, userFilePath, diffPath, modifierFile) {
  funcName = cleanString(funcName);
  
  // Read the user file
  const data = fs.readFileSync(userFilePath, 'utf-8');
  let modifiedData = data;
  
  // Find pragma line and inject import statement after
  const pragmaRegex = /(?<=pragma).+?(?=;)/g;
  const pragmaMatches = data.matchAll(pragmaRegex);
  
  for (const match of pragmaMatches) {
    const fullFcExpr = match[0];
    // Check if import already exists
    if (!modifiedData.includes('import "' + modifierFile + '"')) {
      modifiedData = modifiedData.replace(fullFcExpr, fullFcExpr + ';\nimport "' + modifierFile + '"');
    }
    break;
  }
  
  // Find and replace Contract Name Line with proper inheritance
  const contractRegex = /contract\s+([a-zA-Z0-9_]+)(\s+is\s+[^{]+|\s*)(?={)/g;
  const contractMatches = modifiedData.matchAll(contractRegex);
  
  for (const match of contractMatches) {
    const fullMatch = match[0];
    const contractName = match[1];
    const existingInheritance = match[2] || '';
    
    let newInheritance;
    
    // Check if there's already an inheritance clause
    if (existingInheritance.includes(' is ')) {
      // Contract already has inheritance, add our interface to the list
      if (!existingInheritance.includes('RulesEngineClientCustom')) {
        newInheritance = existingInheritance.replace(' is ', ' is RulesEngineClientCustom, ');
        modifiedData = modifiedData.replace(fullMatch, `contract ${contractName}${newInheritance}`);
      }
    } else {
      // No inheritance yet, add it
      newInheritance = ' is RulesEngineClientCustom';
      modifiedData = modifiedData.replace(fullMatch, `contract ${contractName}${newInheritance}`);
    }
    break;
  }
  
  // Find and modify the function
  const functionPattern = `function\\s+${funcName}\\s*\\([^{]*{`;
  const functionRegex = new RegExp(functionPattern, 'g');
  const functionMatches = modifiedData.matchAll(functionRegex);
  
  for (const match of functionMatches) {
    const fullMatch = match[0];
    if (!fullMatch.includes(`checkRulesBefore${funcName}`)) {
      const modifiedFunction = fullMatch.replace(
        `function ${funcName}`,
        `function ${funcName}`
      ).replace('{', `checkRulesBefore${funcName}(${variables}) {`);
      
      modifiedData = modifiedData.replace(fullMatch, modifiedFunction);
    }
  }
  
  // Write the modified file
  fs.writeFileSync(userFilePath, modifiedData, 'utf-8');
  
  // Generate diff if path is provided
  if (diffPath && diffPath !== 'diff.diff') {
    const diffOutput = diff.createPatch(userFilePath, data, modifiedData);
    fs.writeFileSync(diffPath, diffOutput);
  }
}

/**
 * Checks if a file contains a specific function signature
 */
function fileContainsFunction(filePath, functionSignature) {
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  // Extract function name from the signature
  const functionNameMatch = functionSignature.match(/^([^(]+)\s*\(/);
  if (!functionNameMatch) return false;
  
  const functionName = functionNameMatch[1].trim();
  
  // Create a regex pattern that looks for the function name
  const regexPattern = `function\\s+${functionName}\\s*\\([^)]*\\)`;
  const regex = new RegExp(regexPattern, 'i');
  
  return regex.test(fileContent);
}

/**
 * Validates Solidity files
 */
function validateSolidityFiles(filePaths) {
  const validFiles = [];
  
  for (const filePath of filePaths) {
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.warn(`Warning: File does not exist: ${filePath}`);
      continue;
    }
    
    // Check if file has .sol extension
    if (path.extname(filePath).toLowerCase() !== '.sol') {
      console.warn(`Warning: File is not a Solidity file: ${filePath}`);
      continue;
    }
    
    validFiles.push(filePath);
  }
  
  return validFiles;
}

/**
 * Main function to process policy and generate modifiers
 */
function policyModifierGeneration(configPath, outputFile, filePaths) {
  // Validate Solidity files
  const validFiles = validateSolidityFiles(filePaths);
  if (validFiles.length === 0) {
    console.error('Error: No valid Solidity files provided');
    return;
  }
  
  console.log(`Found ${validFiles.length} valid Solidity files to process`);
  
  // Read and parse the policy configuration
  const configData = fs.readFileSync(configPath, 'utf-8');
  const policyConfig = JSON.parse(configData);
  
  console.log(`Processing policy: ${policyConfig.Policy}`);
  console.log(`Found ${policyConfig.RulesJSON.length} rules to process`);
  
  // Generate modifier file
  generateModifier(configData, outputFile);
  
  // Process each rule
  policyConfig.RulesJSON.forEach((rule, index) => {
    const functionName = rule.functionSignature.split('(')[0].trim();
    
    // Find files that contain the function signature and inject the modifier
    let injectionCount = 0;
    for (const filePath of validFiles) {
      if (fileContainsFunction(filePath, rule.functionSignature)) {
        console.log(`Found matching function in ${filePath}`);
        
        // Inject the modifier
        injectModifier(
          functionName,
          rule.encodedValues,
          filePath,
          'diff.diff',
          outputFile
        );
        
        injectionCount++;
      }
    }
    
    if (injectionCount === 0) {
      console.warn(`Warning: No files found containing function ${rule.functionSignature}`);
    } else {
      console.log(`Injected modifier for ${functionName} into ${injectionCount} files`);
    }
  });
  
  console.log('Policy processing complete!');
}

// Replicate the main function from the original TypeScript
async function injectModifiers(policyJSONFile, modifierFileName, sourceContractFile) {
  policyModifierGeneration(policyJSONFile, modifierFileName, [sourceContractFile]);
}

async function main() {
  const command = process.argv[2];
  
  if (command === "injectModifiers") {
    const policyJSONFile = process.argv[3] || "policy.json";
    const newModifierFileName = process.argv[4] || "src/RulesEngineIntegration.sol";
    const sourceContractFile = process.argv[5] || "src/ExampleContract.sol";
    
    await injectModifiers(policyJSONFile, newModifierFileName, sourceContractFile);
  } else {
    console.log("Invalid command. Please use one of the following commands:");
    console.log("     setupPolicy <OPTIONAL: policyJSONFilePath>");
    console.log("     injectModifiers <policyId> <sourceContractFile> <destinationModifierFile>");
    console.log("     applyPolicy <policyId> <address>");
  }
}

main().catch(console.error);