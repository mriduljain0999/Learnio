let courseDiv = document.querySelector(".courses")

window.onload = function() {
    fetch();
};

document.querySelector(".mycourses").addEventListener("click",function(){
    window.location.href = "adminDashboard.html"
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
    window.location.href = "../signinPage/adminSignin.html"
})

async function fetch(){
    const courses = await axios.get("http://localhost:3000/admin/course/all",{
        headers:{
            token:localStorage.getItem("token")
        }
    })
    render(courses.data);
}

function getRandomNumber() {
    const random = (Math.random() * (5 - 4) + 4); 
    return Math.round(random * 10) / 10;
}


async function render(courses){
    courseDiv.innerHTML = "";
    for(let i=0;i<courses.length;i++){
        let div = document.createElement("div");

        let divImg = document.createElement("div")
        let img = document.createElement("img");

        let title = document.createElement("h5");

        let divCreator = document.createElement("div");
        let username = document.createElement("p");
        let rating  = document.createElement("p")
        divCreator.classList.add("flex")

        div.classList.add("course")

        title.innerHTML = courses[i].title

        img.setAttribute("src",courses[i].imageURL)
        divImg.classList.add("courseImg")
        divImg.appendChild(img)

        const adminName = await axios.post("http://localhost:3000/admin/username",{
            adminID:courses[i].creatorID
        })
        username.innerHTML = adminName.data
        username.classList.add("username")

        let customRating = getRandomNumber();
        rating.innerHTML = `<span class="star">★ </span>${customRating}`

        divCreator.appendChild(username)
        divCreator.appendChild(rating)

        div.appendChild(divImg)
        div.appendChild(title)
        div.appendChild(divCreator)

        courseDiv.appendChild(div);
    }
}