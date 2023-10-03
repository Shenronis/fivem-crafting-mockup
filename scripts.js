const craftsfx = "sfx\\craft.mp3";
const clicksfx = "sfx\\click.mp3";

var blueprints = null
var recipe_list = null
var current_active_tab = null
var current_active_tab_node = null
var current_blueprint = null
var current_item = null
var current_item_img = null
var current_item_label = null
var current_item_result_quantity = null
var craft_btn = null
var craft_quantity_btns = []
var craft_quantity_label = null
var craft_quantity = 1
var craft_max_quantity = 1

inventory = {
    "appistol_part_1": 3,
    "appistol_part_2": 4,
    "appistol_part_3": 3,
    "appistol_part_4": 2,
    "bandage": 1,
    "painkillers": 99,
    "clothe": 2,
    "parts1": 99,
}

const recipes = {
    "ap_pistol":
        {
            type: "weapon",
            label: "AP Pistol",
            amount: 1,
            img: "icons-main\\weapons\\pistol\\weapon_appistol.png",
            recipe: {
                "appistol_part_1": {
                    label: "Bộ phận súng AP 1",
                    amount: 1,
                    img: "icons-main\\weapons\\parts\\appistol_part_1.png",
                },
                "appistol_part_2": {
                    label: "Bộ phận súng AP 2",
                    amount: 1,
                    img: "icons-main\\weapons\\parts\\appistol_part_2.png",
                },
                "appistol_part_3": {
                    label: "Bộ phận súng AP 3",
                    amount: 1,
                    img: "icons-main\\weapons\\parts\\appistol_part_3.png",
                },
                "appistol_part_4": {
                    label: "Bộ phận súng AP 4",
                    amount: 1,
                    img: "icons-main\\weapons\\parts\\appistol_part_4.png",
                },                
            }
    },
    "revolver":
        {
            type: "weapon",
            label: "Heavy Pistol",
            amount: 1,
            img: "icons-main\\weapons\\pistol\\weapon_heavypistol.png",
            recipe: {
                "heavypistol_part_1": {
                    label: "Bộ phận súng 1",
                    amount: 1,
                    img: "icons-main\\weapons\\parts\\heavypistol_part_1.png",
                },
                "heavypistol_part_2": {
                    label: "Bộ phận súng 2",
                    amount: 1,
                    img: "icons-main\\weapons\\parts\\heavypistol_part_2.png",
                },
                "heavypistol_part_3": {
                    label: "Bộ phận súng 3",
                    amount: 1,
                    img: "icons-main\\weapons\\parts\\heavypistol_part_3.png",
                },
                "heavypistol_part_4": {
                    label: "Bộ phận súng 4",
                    amount: 1,
                    img: "icons-main\\weapons\\parts\\heavypistol_part_4.png",
                },
            }
    },
    "medkit":
        {
            type: "consumable",
            label: "Med kit",
            amount: 1,
            img: "icons-main\\medical\\medkits\\firstaid.png",
            recipe: {
                "painkillers": {
                    label: "Thuốc giảm đau",
                    amount: 1,
                    img: "icons-main\\medical\\tablets\\painkillers.png",
                },
                "bandage": {
                    label: "Băng gạc",
                    amount: 2,
                    img: "icons-main\\medical\\bandage.png",
                }            
            }
    },
    "heavypistol_part_1": {
        type: "material",
        label: "Bộ phận súng 1",
        amount: 1,
        img: "icons-main\\weapons\\parts\\heavypistol_part_1.png",
        recipe: {
            "parts1": {
                label: "Phế liệu",
                amount: 10,
                img: "icons-main\\weapons\\parts\\parts1.png",
            },            
        }
    },
    "heavypistol_part_2": {
        type: "material",
        label: "Bộ phận súng 2",
        amount: 1,
        img: "icons-main\\weapons\\parts\\heavypistol_part_2.png",
        recipe: {
            "parts1": {
                label: "Phế liệu",
                amount: 10,
                img: "icons-main\\weapons\\parts\\parts1.png",
            },            
        }
    },
    "heavypistol_part_3": {
        type: "material",
        label: "Bộ phận súng 3",
        amount: 1,
        img: "icons-main\\weapons\\parts\\heavypistol_part_3.png",
        recipe: {
            "parts1": {
                label: "Phế liệu",
                amount: 10,
                img: "icons-main\\weapons\\parts\\parts1.png",
            },            
        }
    },
    "heavypistol_part_4": {
        type: "material",
        label: "Bộ phận súng 4",
        amount: 1,
        img: "icons-main\\weapons\\parts\\heavypistol_part_4.png",
        recipe: {
            "parts1": {
                label: "Phế liệu",
                amount: 10,
                img: "icons-main\\weapons\\parts\\parts1.png",
            },            
        }
    },
    "bandage": {
        type: "material",
        label: "Băng gạc",
        amount: 10,
        img: "icons-main\\medical\\bandage.png",
        recipe: {
            "clothe": {
                label: "Vải",
                amount: 1,
                img: "icons-main\\clothing\\clothe.png",
            },            
        }
    }
}

document.addEventListener("DOMContentLoaded", function(event) {
    blueprints = this.getElementById("blueprint-list")
    recipe_list = this.getElementById("recipe-list")

    current_item_img = this.getElementById("item-img");
    current_item_label = this.getElementById("item-name");
    current_item_result_quantity = this.getElementById("item-amount");

    craft_btn = this.getElementById("craft")
    craft_btn.disabled = true

    var confirm_parent = this.getElementsByClassName("confirmation")[0].children;
    craft_quantity_btns.push(confirm_parent[0])
    craft_quantity_btns.push(confirm_parent[2])
    craft_quantity_btns.push(confirm_parent[3])

    craft_quantity_label = this.getElementById("craft_quantity")
    craft_quantity_label.innerHTML = craft_quantity

    setActiveCategory("weapon", true)
})

function displayRecipes(type) {
    Object.entries(recipes).forEach(([key, value]) => {
        if (value.type == type)
        {
            addBlueprintSelection(type, key, value.label, value.amount, value.img)
        }
    });
}

function addBlueprintSelection(type, name, label, amount, img) {      
    
    var amount_type = (type=="weapon")? "&#160": 'x'+amount

    let item = htmlToElement(`
        <button class="blueprint-btn col-3 m-2 flex-container" onclick="setRecipePanel('`+name+`'); playClick()" >
        <div class="blueprint-img-holder"><img class="blueprint-img" src="`+img+`" alt=""></div>
            <div class="blueprint-label">`+label+`</div>
            <div class="blueprint-amount">`+amount_type+`</div>
        </button>
    `)

    blueprints.appendChild(item)
}

function addRecipe(name, label, img, quantity, req_quantity) {

    var craftable = (quantity >= req_quantity)? "recipe-item":"recipe-item invalid"
    var haveRecipe = recipes.hasOwnProperty(name)
    var icon = haveRecipe?'<i class="fa-solid fa-wrench"></i>' : ""
    var onclick = haveRecipe? "setRecipePanel('"+name+"')": ""
    if (!haveRecipe) craftable += " nocursor"

    let item = htmlToElement(`
        <button class="`+craftable+`" onclick="`+onclick+`">
            <div class="recipe-item-img col-3">
                <div><img src="`+img+`"></div>
                `+icon+`
            </div>
            <div class="recipe-item-label col-6">
                `+label+`
            </div>
            <div class="recipe-item-quantity col-3">
                <span>`+quantity+`</span>
                <span> / </span>
                <span">`+req_quantity+`</span>
            </div>
        </button>
    `)

    recipe_list.appendChild(item)
}

function setRecipePanel(item_name)
{
    if (!recipes.hasOwnProperty(item_name)) return;

    if (recipe_list.innerHTML != "")
    {
        recipe_list.innerHTML = ""
    }

    let object = recipes[item_name]
    let isWeapon = (object.type=="weapon")
    let isOwned = inventory.hasOwnProperty(item_name);

    current_blueprint = object
    if (current_active_tab != object.type) setActiveCategory(object.type)
    if (item_name != current_item) craft_quantity = 1
    
    current_item = item_name
    current_item_img.src = (isOwned)? object.img : ""
    current_item_result_quantity.innerHTML = (isWeapon)? "" : (isOwned)? inventory[item_name]:""
    current_item_label.innerHTML = (isWeapon)? object.label : "x" + object.amount*craft_quantity + " " + object.label
    craft_quantity_label.innerHTML = craft_quantity
    
    var canCraft = true
    var canIncrement = true
    var minDiv = 99 //default max value
    
    if (isWeapon) {
        if (inventory.hasOwnProperty(item_name))
        {
            canCraft=false;
        }
    }

    Object.entries(object.recipe).forEach(([key, value]) => {
        let currentOwned = inventory[key] || 0;
        let req_quantity = value.amount * craft_quantity

        addRecipe(key, value.label, value.img, currentOwned , req_quantity)

        if (canCraft)
        {
            let tmpDiv = Math.trunc(currentOwned / (value.amount))
            if (tmpDiv < minDiv) minDiv=tmpDiv

            if (currentOwned < req_quantity) {
                canCraft = false
            }

            if (currentOwned >= value.amount * (craft_quantity + 1)) {
                canIncrement = true
            }
            else
            {
                canIncrement = false;
            }
        }
    });
    
    craft_btn.disabled = !canCraft
    craft_quantity_btns[0].disabled = isWeapon? true : craft_quantity==1
    craft_quantity_btns[1].disabled = isWeapon? true : canCraft? !canIncrement : true
    craft_max_quantity = minDiv

    if (craft_max_quantity == craft_quantity) craft_quantity_btns[2].disabled=true;
    else craft_quantity_btns[2].disabled = isWeapon? true : canCraft? !(craft_max_quantity!=1) : true
}

function craft() {
    Object.entries(current_blueprint.recipe).forEach(([key, value]) => {
        let req_quantity = value.amount * craft_quantity
        addInventory(key, -req_quantity);
    });    

    addInventory(current_item, craft_quantity * current_blueprint.amount);
    craft_quantity = 1;
    setRecipePanel(current_item);
    playClick();
    playCraft();
}

function setActiveCategory(type, first_load=false)
{    
    if (type != "weapon" && type != "consumable" && type != "material") return;
    if (!first_load) playClick();

    let tab = document.getElementById(type);

    if (current_active_tab_node != null)
    {
        current_active_tab_node.classList.remove("active")
    }

    tab.classList.add("active");
    current_active_tab_node = tab;
    current_active_tab = type;

    clearBlueprintsPanel();
    clearCraftPanel();

    displayRecipes(type)
}

function addQuantity(mode) {
    if (mode < 0) {
        if (craft_quantity > 1) craft_quantity--
    }
    else if (mode == 1) {
        craft_quantity++;
    }
    else {
        craft_quantity = craft_max_quantity;
        console.log(craft_quantity)
    }

    setRecipePanel(current_item)
}

function addInventory(name, amount) {
    if (!inventory.hasOwnProperty(name))
    {
        inventory[name] = 0;
    }

    if (inventory[name] + amount >= 0) {
        inventory[name] += amount;

        if (inventory[name]==0) delete inventory[name]
    }
}

function clearBlueprintsPanel() {
    blueprints.innerHTML = ""
}

function clearCraftPanel() {
    current_item = null
    current_item_img.src = ""
    current_item_result_quantity.innerHTML = "&#160" 
    current_item_label.innerHTML = "&#160"
    recipe_list.innerHTML = ""
    craft_quantity = 1
    craft_quantity_label.innerHTML = craft_quantity
    craft_btn.disabled = true;
    
    craft_quantity_btns.forEach(element => {
        element.disabled = true;
    });
}

function playClick() {
    playSound(clicksfx)
}

function playCraft() {
    playSound(craftsfx)
}

function playSound(src) {
    const audio = new Audio(src);
    audio.play();
}

function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}