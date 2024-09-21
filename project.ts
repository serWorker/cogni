/src/connections/apikeyConnection.ts
import { IConnectionSchema } from "@cognigy/extension-tools";

export const apiKeyConnection: IConnectionSchema = {
	type: "api-key",
	label: "Holds an api-key for an API request.",
	fields: [
		{ fieldName: "key" }
	]
};

/src/connection/openaiConnection.ts
import { IConnectionSchema } from "@cognigy/extension-tools";

export const openAIConnection: IConnectionSchema = {
	type: "api-key",
	label: "Holds an api-key for the OpenAI API.",
	fields: [
		{ fieldName: "key" }
	]
};


/src/nodes/getWeather.ts
// import { createNodeDescriptor, INodeFunctionBaseParams } from "@cognigy/extension-tools";
// import axios from 'axios';

// // Define the interface for the parameters
// export interface IgetWeatherParams extends INodeFunctionBaseParams {
// 	config: {
// 		connection: {
// 			key: string;
// 		};
// 		city: string;
// 		contextStore: string;
// 		storeLocation: string;
// 		inputKey: string;
// 		contextKey: string;
// 	};
// }

// // Main function to get weather information and provide structured output
// export const getWeather = createNodeDescriptor({
// 	type: "getWeather",
// 	defaultLabel: "Get Weather",
// 	preview: {
// 		key: "city",
// 		type: "text"
// 	},
// 	fields: [
// 		{
// 			key: "connection",
// 			label: "The API key that should be used",
// 			type: "connection",
// 			params: {
// 				connectionType: "api-key",
// 				required: true
// 			}
// 		},
// 		{
// 			key: "city",
// 			label: "City",
// 			type: "cognigyText",
// 			defaultValue: "Ratingen",
// 			params: {
// 				required: true
// 			},
// 		},
// 		{
// 			key: "storeLocation",
// 			type: "select",
// 			label: "Where to store the result",
// 			defaultValue: "input",
// 			params: {
// 				options: [
// 					{
// 						label: "Input",
// 						value: "input"
// 					},
// 					{
// 						label: "Context",
// 						value: "context"
// 					}
// 				],
// 				required: true
// 			},
// 		},
// 		{
// 			key: "inputKey",
// 			type: "cognigyText",
// 			label: "Input Key to store Result",
// 			defaultValue: "weather",
// 			condition: {
// 				key: "storeLocation",
// 				value: "input",
// 			}
// 		},
// 		{
// 			key: "contextKey",
// 			type: "cognigyText",
// 			label: "Context Key to store Result",
// 			defaultValue: "weather",
// 			condition: {
// 				key: "storeLocation",
// 				value: "context",
// 			}
// 		},
// 	],
// 	sections: [
// 		{
// 			key: "storage",
// 			label: "Storage Option",
// 			defaultCollapsed: true,
// 			fields: [
// 				"storeLocation",
// 				"inputKey",
// 				"contextKey",
// 			]
// 		}
// 	],
// 	form: [
// 		{ type: "field", key: "connection" },
// 		{ type: "field", key: "city" },
// 		{ type: "section", key: "storage" }
// 	],
// 	appearance: {
// 		color: "#fcb603"
// 	},

// 	function: async ({ cognigy, config }: IgetWeatherParams) => {
// 		const { api } = cognigy;
// 		const { connection, city, storeLocation, inputKey, contextKey } = config;
// 		const { key } = connection;

// 		try {
// 			// Fetch weather data from WeatherAPI
// 			const response = await axios({
// 				method: 'get',
// 				url: `http://api.weatherapi.com/v1/current.json?key=${key}&q=${encodeURI(city)}`
// 			});

// 			// Extract relevant weather information
// 			const weatherData = response.data;
// 			const temperature = weatherData.current.temp_c;
// 			const condition = weatherData.current.condition.text;
// 			const windSpeed = weatherData.current.wind_kph;
// 			const humidity = weatherData.current.humidity;
// 			const cityName = weatherData.location.name;
// 			const countryName = weatherData.location.country;

// 			// Create a structured output message
// 			const weatherReport = `
// 				Weather in ${cityName}, ${countryName}:
// 				- Temperature: ${temperature}°C
// 				- Condition: ${condition}
// 				- Wind Speed: ${windSpeed} km/h
// 				- Humidity: ${humidity}%
// 			`;

// 			// Store full data and return structured response
// 			if (storeLocation === "context") {
// 				api.addToContext(contextKey, weatherData, "simple");
// 			} else {
// 				api.addToInput(inputKey, weatherData);
// 			}

// 			// Send the structured weather report back to the user
// 			api.say(weatherReport);

// 		} catch (error) {
// 			const errorMessage = "I couldn't retrieve the weather data. Please try again later.";
			
// 			// Handle errors and store them in context or input
// 			if (storeLocation === "context") {
// 				api.addToContext(contextKey, { error: errorMessage }, "simple");
// 			} else {
// 				api.addToInput(inputKey, { error: errorMessage });
// 			}

// 			// Send error message back to the user
// 			api.say(errorMessage);
// 		}
// 	}
// });

import { createNodeDescriptor, INodeFunctionBaseParams } from "@cognigy/extension-tools";
import axios from 'axios';

// Define the interface for the parameters
export interface IgetWeatherParams extends INodeFunctionBaseParams {
	config: {
		connection: {
			key: string;  // WeatherAPI Key
		};
		openaiConnection: {
			key: string;  // OpenAI API Key
		};
		city: string;
		contextStore: string;
		storeLocation: string;
		inputKey: string;
		contextKey: string;
		sarcasmPreference: string;  // New field to track user sarcasm preference
	};
}

// Main function to get weather information and provide structured output
export const getWeather = createNodeDescriptor({
	type: "getWeather",
	defaultLabel: "Get Weather",
	preview: {
		key: "city",
		type: "text"
	},
	fields: [
		{
			key: "connection",
			label: "The API key that should be used",
			type: "connection",
			params: {
				connectionType: "api-key",
				required: true
			}
		},
		{
			key: "openaiConnection",  // Add connection for OpenAI API
			label: "The API key for OpenAI",
			type: "connection",
			params: {
				connectionType: "api-key",
				required: true
			}
		},
		{
			key: "city",
			label: "City",
			type: "cognigyText",
			defaultValue: "Ratingen",
			params: {
				required: true
			},
		},
		{
			key: "sarcasmPreference",  // New field to track sarcasm preference
			label: "Sarcasm Preference",
			type: "select",
			defaultValue: "friendly",
			params: {
				options: [
					{
						label: "Friendly",
						value: "friendly"
					},
					{
						label: "Sarcastic",
						value: "sarcastic"
					}
				],
				required: true
			}
		},
		{
			key: "storeLocation",
			type: "select",
			label: "Where to store the result",
			defaultValue: "input",
			params: {
				options: [
					{
						label: "Input",
						value: "input"
					},
					{
						label: "Context",
						value: "context"
					}
				],
				required: true
			},
		},
		{
			key: "inputKey",
			type: "cognigyText",
			label: "Input Key to store Result",
			defaultValue: "weather",
			condition: {
				key: "storeLocation",
				value: "input",
			}
		},
		{
			key: "contextKey",
			type: "cognigyText",
			label: "Context Key to store Result",
			defaultValue: "weather",
			condition: {
				key: "storeLocation",
				value: "context",
			}
		},
	],
	sections: [
		{
			key: "storage",
			label: "Storage Option",
			defaultCollapsed: true,
			fields: [
				"storeLocation",
				"inputKey",
				"contextKey",
			]
		}
	],
	form: [
		{ type: "field", key: "connection" },
		{ type: "field", key: "openaiConnection" },  // Add OpenAI connection field
		{ type: "field", key: "city" },
		{ type: "field", key: "sarcasmPreference" },  // Add sarcasm preference field
		{ type: "section", key: "storage" }
	],
	appearance: {
		color: "#fcb603"
	},

	function: async ({ cognigy, config }: IgetWeatherParams) => {
		const { api } = cognigy;
		const { connection, openaiConnection, city, storeLocation, inputKey, contextKey, sarcasmPreference } = config;
		const { key } = connection;
		const { key: openaiKey } = openaiConnection;

		try {
			// Fetch weather data from WeatherAPI
			const response = await axios({
				method: 'get',
				url: `http://api.weatherapi.com/v1/current.json?key=${key}&q=${encodeURI(city)}`
			});

			// Extract relevant weather information
			const weatherData = response.data;
			const temperature = weatherData.current.temp_c;
			const condition = weatherData.current.condition.text;
			const windSpeed = weatherData.current.wind_kph;
			const humidity = weatherData.current.humidity;
			const cityName = weatherData.location.name;
			const countryName = weatherData.location.country;

			// Create a structured output message
			const weatherInfo = `The weather in ${cityName}, ${countryName} is currently ${condition} with a temperature of ${temperature}°C, wind speed of ${windSpeed} km/h, and humidity of ${humidity}%.`;

			// Generate response using OpenAI based on sarcasm preference
			const openaiPrompt = `
				Generate a ${sarcasmPreference === "sarcastic" ? "sarcastic" : "friendly"} response based on this information: "${weatherInfo}"
			`;

			const openaiResponse = await axios.post("https://api.openai.com/v1/completions", {
				prompt: openaiPrompt,
				max_tokens: 150,
				model: "text-davinci-003"
			}, {
				headers: {
					'Authorization': `Bearer ${openaiKey}`
				}
			});

			const openaiMessage = openaiResponse.data.choices[0].text.trim();

			// Store result in context or input
			if (storeLocation === "context") {
				api.addToContext(contextKey, weatherData, "simple");
				api.addToContext(`${contextKey}_message`, openaiMessage, "simple");
			} else {
				cognigy.input[inputKey] = weatherData;
				cognigy.input[`${inputKey}_message`] = openaiMessage;
			}

			// Send the OpenAI-generated response back to the user
			api.say(openaiMessage);

		} catch (error) {
			const errorMessage = "I couldn't retrieve the weather data or generate a response. Please try again later.";

			// Handle errors and store them in context or input
			if (storeLocation === "context") {
				api.addToContext(contextKey, { error: errorMessage }, "simple");
			} else {
				cognigy.input[inputKey] = { error: errorMessage };
			}

			// Send error message back to the user
			api.say(errorMessage);
		}
	}
});
1

/src/module.ts
// import { createExtension } from "@cognigy/extension-tools";

// import { getWeather } from "./nodes/getWeather";
// import { apiKeyConnection } from "./connections/apiKeyConnection";


// export default createExtension({
// 	nodes: [
// 		getWeather
// 	],

// 	connections: [
// 		apiKeyConnection
// 	],

// 	options: {
// 		label: "Weather API"
// 	}
// });

import { createExtension } from "@cognigy/extension-tools";
import { getWeather } from "./nodes/getWeather";
import { apiKeyConnection } from "./connections/apiKeyConnection";
import { openAIConnection } from "./connections/openaiConnection";  // Import OpenAI connection

export default createExtension({
	nodes: [
		getWeather
	],

	connections: [
		apiKeyConnection,
		openAIConnection  // Add OpenAI connection
	],

	options: {
		label: "Weather and OpenAI API Integration"
	}
});


/package.json
{
  "name": "sergiu-weather-extension",
  "version": "1.0.0",
  "description": "Integrates the weather api and openai with Cognigy.AI",
  "main": "build/module.js",
  "scripts": {
    "transpile": "tsc -p .",
    "zip": "tar cfz sergiuweatherextension.tar.gz build/* package.json package-lock.json README.md icon.png",
    "build": "npm run transpile && npm run zip"
  },
  "keywords": [
    "Weather"
  ],
  "author": "Sergiu Popa",
  "license": "MIT",
  "dependencies": {
    "@cognigy/extension-tools": "^0.16.0",
    "axios": "^1.7.7"
  },
  "devDependencies": {
    "@types/axios": "^0.14.0",
    "@types/node": "^13.13.15",
    "typescript": "^5.6.2"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/weather-extension-cognigy.git"
  }
}



/tsconfig.json
{
	"compileOnSave": true,
	"compilerOptions": {
		"emitDecoratorMetadata": true,
		"experimentalDecorators": true,
		"target": "es2017",
		"module": "commonjs",
		"rootDir": "src",
		"outDir": "build",
		"sourceMap": true,
		"moduleResolution": "node"
	}
}
  
/tslint.json
{
    "rules": {
        "prefer-for-of": true,
        "only-arrow-functions": [true, "allow-declarations", "allow-named-functions"],
        "no-var-keyword": true,
        "no-var-requires": false,
        "comment-format": [true, "check-space"],
        "no-duplicate-variable": true,
        "no-eval": false,
        "no-internal-module": true,
        "no-trailing-whitespace": true,
        "one-line": [true, "check-open-brace", "check-whitespace", "check-catch", "check-finally", "check-else"],
        "semicolon": [true, "always"],
        "triple-equals": [true, "allow-null-check"],
        "typedef-whitespace": [true, {
            "call-signature": "nospace",
            "index-signature": "nospace",
            "parameter": "nospace",
            "property-declaration": "nospace",
            "variable-declaration": "nospace"
        }],
        "typedef": [true, "call-signature", "parameter", "member-variable-declaration"],
        "variable-name": [true, "ban-keywords"],
        "whitespace": [true,
            "check-branch",
            "check-decl",
            "check-operator",
            "check-separator",
            "check-type"
        ]
    }
}

/README.md
# Weather Extension

This Cognigy AI extension allows you to retrieve weather information for a given city using the WeatherAPI.

## Nodes
- **Get Weather**: Fetches the current temperature and weather description for a city.

## Parameters
- **City**: The name of the city to retrieve weather data for.
- **API Key**: The WeatherAPI API key required to make the API request.
