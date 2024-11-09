let courseDiv = document.querySelector(".courses")

window.onload = function() {
    fetch();
};

document.querySelector(".allcourses").addEventListener("click",function(){
    window.location.href = "userAll.html"
})

document.querySelectorAll(".terms").forEach(function(element) {
    element.addEventListener("click", function(){
        window.location.href = "../signupPage/terms.txt";
    });
});
document.querySelectorAll(".privacy").forEach(function(element) {
    element.addEventListener("click", function(){
        window.location.href = "../signupPage/privacy.txt";
    });
});
document.querySelector(".help").addEventListener("click",function(){
    window.location.href = "../signinPage/help-center.txt";
})
document.querySelector(".logout").addEventListener("click",function(){
    localStorage.removeItem("token");
    window.location.href = "../signinPage/userSignin.html"
})

async function fetch(){
    const courses = await axios.get("http://localhost:3000/user/purchases",{
        headers:{
            token:localStorage.getItem("token")
        }
    })
    render(courses.data);
}

function render(courses){
    courseDiv.innerHTML = "";
    for(let i=0;i<courses.length;i++){
        let div = document.createElement("div");

        let title = document.createElement("h5");
        let desc = document.createElement("p");

        let divImg = document.createElement("div")
        let img = document.createElement("img");

        let contentBtn = document.createElement("button")
        contentBtn.innerHTML = "View Content"
        contentBtn.classList.add(".viewContent")
        contentBtn.addEventListener("click",function(){
            window.location.href = "content.txt"
        })

        div.classList.add("course")

        title.innerHTML = courses[i].title
        desc.innerHTML = courses[i].description

        img.setAttribute("src",courses[i].imageURL)
        divImg.classList.add("courseImg")
        divImg.appendChild(img)

        div.appendChild(divImg)
        div.appendChild(title)
        div.appendChild(desc)
        div.appendChild(contentBtn)

        courseDiv.appendChild(div);
    }
}