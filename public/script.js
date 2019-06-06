const themeButton = document.querySelector(".page-header__btnToggle");
const themeUL = document.querySelector(".page-header__toggle");
const themeDIV = document.querySelector(".page-header__themeChoose");

document.querySelector('.no--js').classList.remove("no--js");



(function getCookie(){//Send request to get cookie and set window theme
    const xhr = new XMLHttpRequest();

    xhr.onreadystatechange = () => {
        if(xhr.status === 200 && xhr.readyState === 4) {
            const theme = xhr.responseText;
            switchTheme(theme);
        }
    }
    xhr.open("GET", "/theme");
    xhr.send();
}());

function switchTheme(theme){//Just to switch themes
    switch(theme){
        case "dark":
            document.body.classList.add("theme-dark");
            themeUL.classList.remove("page-header__toggle--active");
            break;
        case "light":
            document.body.classList.remove("theme-dark");
            themeUL.classList.remove("page-header__toggle--active");
            break;
    }
}

function sendCookieInfo(data){ //Sends POST request to server that writes cookie value
    const xhr = new XMLHttpRequest();

    const params = Object.keys(data).map( x => {
        return encodeURIComponent(x) + "=" + encodeURIComponent(data[x]);
    }).join("&");   

    xhr.onreadystatechange = function(){
        if(xhr.status === 200 && xhr.readyState === 4){
            const response = xhr.responseText;
            // console.log(`Finished succesfully: ${xhr.status} (${xhr.statusText})\n` );
        }
    }

    xhr.open("POST", '/');
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(params);
}

//Front-end

themeDIV.addEventListener("mouseover", (e) => {
    e.preventDefault();
    themeUL.classList.add("page-header__toggle--active");
});

themeDIV.addEventListener("mouseleave", (e) => {
    e.preventDefault();
    themeUL.classList.remove("page-header__toggle--active");
});

themeUL.addEventListener("click", (e) => {
    if(e.target.tagName === "LI"){
        const button = e.target;
        const buttonText = button.textContent.toLocaleLowerCase();
        switchTheme(buttonText);

        sendCookieInfo({theme: buttonText});
    }

});


