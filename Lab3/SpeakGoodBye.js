(function(){
    let speakWord = "Good Bye";
    window.goodByeSpeak = {
        speak: function(name){
            console.log(speakWord + " " + name)
        }
    }
})();