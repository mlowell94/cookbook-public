import express from "express";
import mysql from "mysql";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import { createHash } from "crypto";

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const hash = (string) => createHash('sha256').update(string).digest('hex');


const app = express();
app.use(express.json())
app.use(cors());
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const upload = multer( {storage: storage} )

const db = mysql.createConnection({
    host: "localhost",
    user:"root",
    password:"password", // Put your MySQL password here
    database: "cookbook", // Make sure this corresponds to the database where you ran the commands from the schema.sql queries
    multipleStatements: "true" // This allows you to do things like add a new recipe and then go to that recipe's page
})


const convertPost = (obj) => {
    let newArray = ['('];
    for (const property in obj) {
        if(obj[property] === null) {
            newArray.push(obj[property] + ', ')
        } else {
            newArray.push('"' + obj[property] + '", ')
        }
    }
    newArray[newArray.length - 1] = newArray[newArray.length - 1].replace(', ','');
    newArray.push(')');
    return newArray.join('');
}

const convertArray = (name, array) => {
    let newArray = [];
    for (let i = 0; i < array.length; i++) {
        if (i === (array.length - 1)) {
            newArray.push('((SELECT id FROM recipes WHERE `name` = "' + name + '"), "' + array[i]+'")');
        } else {
            newArray.push('((SELECT id FROM recipes WHERE `name` = "' + name + '"), "' + array[i]+'"),\n');
        }
    }
    return newArray.join('');
}

const convertTags = (name, tags, type) => { // this will be fed 'recipe' or 'collection' for type 
    let newStatement = 'DELETE FROM ' + type + '_tag WHERE '+ type +'_id = (SELECT id FROM ' + type + 's WHERE `name` = "' + name + '");\n';
    const newArray = tags.split(', ');
    for (let i = 0; i < newArray.length; i++) {
        const temp = 'INSERT IGNORE INTO tags (`name`) VALUES ("' + newArray[i] +'");\n' + 
        'INSERT INTO ' + type + '_tag (tag_id, ' + type + '_id) VALUES ((SELECT id FROM tags WHERE `name` = "' + newArray[i] + '"), ' +
        '(SELECT id FROM ' + type + 's WHERE `name` = "' + name + '"));';
        newStatement += temp;
    }
    return newStatement;
}


app.get("/recipes", (req,res) => {
    const q = "SELECT id, `name`, image_url, last_eaten, serves FROM recipes";
    db.query(q, (err,data) => {
        if(err) {
            return res.json(err)
        } else {
            return res.json(data)
        }
    })
})

app.get("/collections", (req, res) => {
    const q = "SELECT `name` FROM collections";
    db.query(q, (err,data) => {
        if(err) {
            return res.json(err)
        } else {
            return res.json(data)
        }
    })
})

app.get("/recipe", (req,res) => {
    const search = req.query.search;
    const q = 
    'SELECT id, `name`, image_url, last_eaten, serves, calories, carbohydrates, fat, protein, cook_time, prep_time FROM recipes WHERE `name` = "' + search + '";\n' +
    'SELECT `name` FROM ingredients WHERE `recipe_id` = (SELECT id FROM recipes WHERE `name` = "' + search + '");\n' +
    'SELECT `name` FROM instructions WHERE `recipe_id` = (SELECT id FROM recipes WHERE `name` = "' + search + '");\n' +
    'SELECT name FROM tags JOIN recipe_tag ON (recipe_id = (SELECT id FROM recipes WHERE `name` = "' + search +'") AND tags.id = tag_id);';
    db.query(q, (err,data) => {
        if(err) {
            return res.json(err)
        } else {
            return res.json(data)
        }
    })
})

app.get("/searchresult", (req, res) => {
    const q = req.query.search.replace(/%20/g, " ")
    .replace(/%27/g, '"')
    .replace(/%3E/g, ">")
    .replace(/%3C/g, "<")
    .replace(/%25/g, "%")
    .replace(/%22/g, '"');
    db.query(q, (err, data) => {
        if(err) {
            console.log(err)
            return res.json(err)
        } else {
            return res.json(data)
        }
    })
})

app.get("/uploads", (req, res) => {
    const imageURL = req.query.filename;
    res.sendFile('./uploads/'+imageURL, {root : __dirname});
})

app.get("/inclusive", (req, res) => {
    const q = 
    'SELECT collections.`name` FROM collections\n' +
    'JOIN recipes_collections ON (recipe_id = (SELECT id FROM recipes WHERE `name` = "' + req.query.search + '"))\n' +
    'AND collections.id = collection_id;'
    db.query(q, (err, data) => {
        if(err) {
            console.log(err)
            return res.json(err)
        } else {
            return res.json(data)
        }
    })
})

app.get("/exclusive", (req, res) => {
    const q =
    'SELECT collections.name FROM collections\n' +
    'WHERE name NOT IN (SELECT collections.`name` FROM collections JOIN recipes_collections ON\n' +
    '(recipe_id = (SELECT id FROM recipes WHERE `name` = "' + req.query.search + '"))\n' +
    'AND collections.id = collection_id);'
    db.query(q, (err, data) => {
        if(err) {
            console.log(err)
            return res.json(err)
        } else {
            return res.json(data)
        }
    })
})

app.get("/get_ct", (req, res) => {
    const q = 'SELECT tags.`name` FROM tags JOIN collection_tag ON' + 
    '(collection_id = (SELECT id FROM collections WHERE `name` = "' + req.query.search + '")) AND tags.id = tag_id;'
    db.query(q, (err, data) => {
        if(err) {
            console.log(err)
            return res.json(err)
        } else {
            return res.json(data)
        }
    })
})

app.post("/new_r", (req, res) => {
    const newRecipe = convertPost(req.body.newRecipe);
    const ingredients = convertArray(req.body.newRecipe.name, req.body.ingredients)
    const instructions = convertArray(req.body.newRecipe.name, req.body.instructions)
    const tags = (req.body.tags !== null ? convertTags(req.body.newRecipe.name, req.body.tags, 'recipe') : null)
    const q = 
    'INSERT INTO recipes (`name`, image_url, last_eaten, serves, calories, protein, carbohydrates, fat, prep_time, cook_time)\n' +
    'VALUES' + newRecipe + ';\n ' +
    'INSERT INTO ingredients (recipe_id, `name`)\n' +
    'VALUES ' + ingredients + ';\n' +
    'INSERT INTO instructions (recipe_id, `name`)\n' +
    'VALUES ' + instructions + ';\n' + tags;
    db.query(q, (err, data) => {
        if(err) {
            return res.json(err);
        } else {
            return res.json(data);
        }
    })
})

app.post('/upload', upload.single("image"), function(req, res) {
    const file = req.file;
  });

app.post('/delete', (req,res) => {
    if(req.body.image_url !== null) {
        fs.unlink('./uploads/' + req.body.image_url, (err) => {
            if(err) {
                console.log(err);
            }
        })
    }
    const q = 
    'DELETE FROM recipes_collections WHERE recipe_id = ' + req.body.id + ';\n' +
    'DELETE FROM ingredients WHERE recipe_id = ' + req.body.id + ';\n' +
    'DELETE FROM instructions WHERE recipe_id = ' + req.body.id + ';\n' +
    'DELETE FROM recipe_tag WHERE recipe_id = ' + req.body.id + ';\n' +
    'DELETE FROM recipes WHERE id = ' + req.body.id + ';\n';
    db.query(q, (err, data) => {
        if(err) {
            return res.json(err);
        } else {
            return res.json(data);
        }
    })
})

app.post('/delete_c', (req, res) => {
    console.log(req.body)
    const q = 
    'DELETE FROM collection_tag WHERE collection_id = (SELECT id FROM collections WHERE `name` = "' + req.body.name + '");\n' +
    'DELETE FROM recipes_collections WHERE collection_id = (SELECT id FROM collections WHERE `name` = "' + req.body.name + '");\n' +
    'DELETE FROM collections WHERE `name` = "' + req.body.name + '";'
    console.log(q);
    db.query(q, (err, data) => {
        if(err) {
            return res.json(err);
        } else {
            return res.json(data);
        }
    })
})

app.post('/rc_add', (req, res) => {
    const q = 
    'INSERT INTO recipes_collections (recipe_id, collection_id) VALUES (' + req.body.recipeID + ', ' + 
    '(SELECT id FROM collections WHERE `name` = "' + req.body.collection + '"));'
    db.query(q, (err, data) => {
        if(err) {
            return res.json(err);
        } else {
            return res.json(data);
        }
    })
})

app.post('/rc_remove', (req, res) => {
    const q = 
    'DELETE FROM recipes_collections WHERE recipe_id = ' + req.body.recipeID + ' AND collection_id = ' +
    '(SELECT id FROM collections WHERE `name` = "' + req.body.collection + '");'
    db.query(q, (err, data) => {
        if(err) {
            return res.json(err);
        } else {
            return res.json(data);
        }
    })
})

app.post('/delete_img', (req,res) => {
    fs.unlink('./uploads/' + req.body.data, (err) => {
        if(err) {
            console.log(err)
        }
    })
})

app.post('/update_r', (req, res) => {
    const updatedRecipe = req.body.newRecipe;
    const ingredients = convertArray(req.body.newRecipe.name, req.body.ingredients)
    const instructions = convertArray(req.body.newRecipe.name, req.body.instructions)
    const tags = convertTags(req.body.newRecipe.name, req.body.tags, 'recipe')
    const q = "UPDATE recipes \n" +
    'SET `name` = "' + updatedRecipe.name + '",\n' +
    'image_url = "' + updatedRecipe.imageURL + '",\n' +
    'last_eaten = "' + updatedRecipe.lastEaten.substring(0,10) + '",\n' +
    'serves = ' + updatedRecipe.serves + ',\n' +
    'calories = ' + updatedRecipe.calories + ',\n' +
    'protein = ' + updatedRecipe.protein + ',\n' +
    'carbohydrates = ' + updatedRecipe.carbohydrates + ',\n' +
    'fat = ' + updatedRecipe.fat + ',\n' +
    'prep_time = ' + updatedRecipe.prepTime + ',\n' +
    'cook_time = ' + updatedRecipe.cookTime + '\n' +
    'WHERE id = ' + updatedRecipe.id + ';\n' +
    'DELETE from ingredients WHERE recipe_id = ' + updatedRecipe.id + ';' +
    'DELETE from instructions WHERE recipe_id = ' + updatedRecipe.id + ';' +
    ((ingredients.length >= 1) ? 'INSERT INTO ingredients (recipe_id, `name`)\n ' + 'VALUES ' + ingredients + ';\n' : '') +
    ((instructions.length >= 1) ? 'INSERT INTO instructions (recipe_id, `name`)\n ' + 'VALUES ' + instructions + ';\n' : '') + tags;
    db.query(q, (err, data) => {
        if(err) {
            return res.json(err);
        } else {
            return res.json(data);
        }
    })
})

app.post('/update_c', (req, res) => {
    const tags = convertTags(req.body.oldName, req.body.tags, 'collection');
    const q = 
    tags + 
    'UPDATE collections `name` SET `name` = "' + req.body.newName + '" WHERE (`name` = "' + req.body.oldName + '");';
    db.query(q, (err, data) => {
        if(err) {
            return res.json(err);
        } else {
            return res.json(data);
        }
    })
})

app.post('/login', (req, res) => {
  const hashedSubmission = hash(req.body.password)
  const q = 'SELECT * FROM passwords WHERE password = "' + hashedSubmission + '";';
  db.query(q, (err, data) => {
    if(err) {
        res.send({token: ''})
    } else {
        if(data.length !== 0) {
            res.send({token: true})
        } else {
            res.send('')
        }
    }
  })
});

app.post('/new_c', (req,res) => {
    const newCollection = req.body.name;
    const tags = (req.body.tags !== null ? convertTags(req.body.name, req.body.tags, 'collection') : null)
    const q = 
    "INSERT INTO collections (`name`)\n" +
    'VALUES ("' + req.body.name + '");\n' + tags;
    db.query(q, (err, data) => {
        if(err) {
            return res.json(err);
        } else {
            return res.json(data);
        }
    })
});

app.listen(8800)