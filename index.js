const axios = require("axios").default;
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');

const fileHandler = require('./src/utils.js');
const { getComponentAsJSON } = require('./src/componentExport.js')

const optionsDefinition = [
  { name: "config", alias: "c", type: String },
  { name: "token", alias: "t", type: String },
  { name: "organization", alias: "o", type: String },
  { name: "environment", alias: "e", type: String },
  { name: "help", type: Boolean }
];

const options = commandLineArgs(optionsDefinition, { stopAtFirstUnknown: true });

const sections = [
  {
    header: 'Apigee configruation export',
    content: 'Application to export apigee environment configurations such as targetServers, Caches etc'
  },
  {
    header: 'Options',
    optionList: [
      { name: 'config', description: 'The name of the environment resources to export. Allowed values are, all caches, kvms, keystores, targetservers, virtualhost, references, aliases, '},
      { name: 'token', description: 'Apigee Edge username with appropriate permissions.' },
      { name: 'organization', description: 'The name of the Apigee Edge Organization' },
      { name: 'environment', description: 'The name of the Apigee Edge Enviroment' }
    ]
  }
]

const usage = commandLineUsage(sections)

var valid = options.help || (
  options.config && options.token && options.organization && options.environment
)

if (!valid || options.help) {
  console.log(usage)
}

var config = options.config
var token = options.token
var organization = options.organization
var environment = options.environment

const host = "api.enterprise.apigee.com"

const client = axios.create({
  baseURL: `https://${host}/v1/organizations/${organization}/environments/${environment}`,
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

//Create the directory to store the environment config files
var rootdir = fileHandler.createRootDir(organization, environment);

const configHandlers = {
  all: async () => await Promise
    .all(Object.values(configHandlers)
    .map(async handler => (handler !== configHandlers.all) ? await handler() : undefined)),
  caches:        async () => await getComponentAsJSON("caches",        client, fileHandler.createConfigFile(rootdir, "caches.json")),
  kvms:          async () => await getComponentAsJSON("keyvaluemaps",  client, fileHandler.createConfigFile(rootdir, 'kvms.json')),
  keystores:     async () => await getComponentAsJSON("keystores",     client, fileHandler.createConfigFile(rootdir, 'keystores.json')),
  targetservers: async () => await getComponentAsJSON("targetServers", client, fileHandler.createConfigFile(rootdir, 'targetServers.json')),
  virtualhosts:  async () => await getComponentAsJSON("virtualHosts",  client, fileHandler.createConfigFile(rootdir, 'virtualHosts.json')),
  references:    async () => await getComponentAsJSON("references",    client, fileHandler.createConfigFile(rootdir, 'references.json')),
  aliases:       async () => await getComponentAsJSON("aliases",       client, fileHandler.createConfigFile(rootdir, 'aliases.json'))
};

if (configHandlers[config]) {
  configHandlers[config]();
} else {
  console.log(`Invalid config option: ${config}`);
  console.log(usage);
}