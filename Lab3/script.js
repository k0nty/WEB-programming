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
})();