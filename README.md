# apigee-edge-dump
Simple nodejs tool to export apigee edge environment components

The exported files can be used for automating config deployments using the Apigee Config Maven Plugin as well as CI/CD tools such as Jenkins.

After executing the command to export the configuration, it will create the following directory strucuture that would contain the config files.

Inspired by https://www.npmjs.com/package/apigee-config-export
 
```
<org>/
    env/
        test/
            caches.json
            kvms.json
        prod/
            targetserver.json
            kvms.json
        env1/
        env2/
        .
        .
        .
        envN
```

## Installation
```
npm install
```

## Usage
```
apigee-config-export --config=<Config Name> --token=<acces_token> --host=https://api.enterprise.apigee.com/v1 --organization=<organization> --environment=<environment>
```

## Allowed values for config
```
all             - exports all environment configs
caches          - exports caches
kvms            - exports key value maps
keystores       - exports keystores
targetservers   - exports target servers
virtualhost     - exports virtual hosts
references      - exports references
aliases         - exports aliases
```
