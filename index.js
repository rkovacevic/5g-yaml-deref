yaml = require('js-yaml');
fs   = require('fs');
jsonref = require('json-schema-ref-parser');
_ = require('lodash');

process.chdir('./yaml5g');

process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error.message);
});

var yamls = fs.readdirSync(".")

const init = async () => {
  yamls = await Promise.all(_.map(yamls, function(y) {
      return new Promise(function(resolve, reject) {
      const yamlObj = yaml.load(fs.readFileSync("./" + y, "utf8"))
      jsonref.dereference(yamlObj, function(err, schema) {
        if (err) {
          reject(err)
          return
        }
        console.log(y) 
        fs.writeFileSync("../yaml5g_dereferenced/" + y, yaml.dump(schema, { noRefs: true }))
      })
    })
  }))
}

init()

