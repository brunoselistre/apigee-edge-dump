const { writeToFileAsync } = require('./fileHandler.js');
const getComponentAsJSON = async (component, client, configFile) => {
  try {
    const response = await client.get(`/${component}`);
    for (const value of response.data) {
        let componentData;
        const fetchComponent = await client.get(`/${component}/${value}`);
        
        if(fetchComponent.data.name){
          componentData = { name: fetchComponent.data.name };
        }
        else {
          componentData = fetchComponent.data
        }
        await writeToFileAsync(configFile, componentData);
        console.log("Retrieved data from ===> " + fetchComponent.request.res.responseUrl);
    }
  } catch (err) {
    console.log(err.response.status);
    console.log(err.response.headers);
    console.log(err.response.data);
    console.log("----------------------------------")
  }
}
exports.getComponentAsJSON = getComponentAsJSON;