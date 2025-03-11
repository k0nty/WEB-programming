(function(){
    let speakWord = "Hello";
    window.helloSpeak = {
        speak: function(name){
            console.log(speakWord + " " + name);
        }
    }
})();