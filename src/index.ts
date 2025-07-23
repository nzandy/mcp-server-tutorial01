// Entry point
import * as readline from "node:readline";
import {stdin, stdout} from "node:process";

const serverInfo = {
    name: "Coffee Shop Server",
    version: "1.0.0",
};

const drinks = [
    {
        name: "Latte",
        price: 2.50,
        description: "A latte (short for \"caffè latte,\" which means \"milk coffee\" in Italian) is a popular espresso-based coffee drink",
    },
    {
        name: "Flat white",
        price: 2.50,
        description: "A flat white is an espresso-based coffee drink that originated in Australia or New Zealand. It is similar to a latte but has some key differences",
    },
    {
        name: "Tea",
        price: 2.00,
        description: "A cup of tea",
    },
    {
        name: "Water",
        price: 1.00,
        description: "A glass of water",
    }
]

const tools = [
    {
        name: "getDrinkNames",
        description: "Get the names of all available drinks in the shop",
        inputSchema: {type: "object", properties: {}},
    },
    {
        name: "getDrinkDetails",
        description: "Get the details of a specific drink in the shop",
        inputSchema: {
            type: "object", 
            properties: {
                drinkName: {
                    type: "string", 
                    description: "The name of the drink to get details for"
                }}},
    },
]

const rl = readline.createInterface({
    input: stdin, 
    output: stdout
});

function sendResponse(id: number, result: object){
    const response = {
        result,
        jsonrpc: "2.0",
        id
    }
    console.log(JSON.stringify(response));
}

(async function main (){
    for await (const line of rl){
        try {
            const json = JSON.parse(line);
            if (json.jsonrpc === "2.0"){
                if (json.method === "initialize"){
                    sendResponse(json.id, {
                        protocolVersion: "2025-03-26",
                        capabilities: {
                            tools: {listChanged: true},
                        },
                        serverInfo,
                    });
                }
                if (json.method === "tools/list"){
                    sendResponse(json.id, {
                        tools: tools.map((tool) => ({
                            name: tool.name,
                            description: tool.description,
                            inputSchema: tool.inputSchema
                        })),
                    });
                }
            }
        } catch (error){
            console.error(`Error parsing JSON: ${error}`);
            continue;
        }

        console.log(`Received: ${line}`);
    }
})();
