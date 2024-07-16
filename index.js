import * as fs from "node:fs/promises";
import { question } from 'readline-sync';
let result = [];
let SalesTax = 0;
let Total = 0;
async function getItems() {
  try {
    const data = await fs.readFile("DataBase.json", "utf-8");
    const items = JSON.parse(data);
    items.forEach((ele, index)=>{
        console.log(`${index} for ${ele.name} `);
    });
    let x = question('Enter Number of items you want: ');
    for(let i = 0; i < x; i++){
        const index = Number(question('Enter your item number: '));
        const quantity = Number(question('Enter quantity of item: '));
        const amt = bill(items[index], quantity);
        let res = quantity + " " + items[index].name + " " + amt[0].toFixed(2);
        if(items[index].import){
            res = quantity + " imported " + items[index].name + " " + amt[0].toFixed(2);
        }
        result.push(res);
        SalesTax += amt[1];
        Total += Number(amt[0].toFixed(2)) + Number(amt[1].toFixed(2));
        Total = Number(Total.toFixed(2));
    }
    printBill();
  } catch (error) {
    console.error("there was an error:", error.message);
  }
}
getItems();
function bill(obj, quantity) {
    let totalPrice = obj.price * quantity;
    let tax = 0;
    if(obj.category === "other"){
        tax = totalPrice*0.1
    }
    if (obj.import) {
        tax += totalPrice*0.05;
    }
    return [totalPrice+tax, tax];
}
function printBill() {
    result.forEach((ele) => console.log(ele))
    console.log(`Sales Taxes: ${SalesTax.toFixed(2)}`);
    console.log(`Total: ${Total}`);
}
