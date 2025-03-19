(function(){
    let names = ["Bill", "John", "Jen", "Jason", "Paul", "Frank", "Steven", "Larry", "Paula", "Laura", "Jim"];
    
    for (let i = 0; i < names.length; i++) {
        
        let name = names[i];
        if (name.charAt(0).toLowerCase() == "j") {
            goodByeSpeak.speak(name)
        } else {
            helloSpeak.speak(name)
        }
    }

    console.log("Якщо кількість букв в імені парна - \" was kicked for bad joke\", а якщо непарна - \"You are beautiful person \"");

    for(let i = 0; i < names.length; i++){
        let name = names[i];
        if(name.length % 2 == 0){
            console.log(name + " was kicked for bad joke");
        }else{
            console.log("You are beautiful person " + name);
        }
    }
})();