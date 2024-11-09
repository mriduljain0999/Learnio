let courseDiv = document.querySelector(".courses")

window.onload = function() {
    fetch();
};

document.querySelector(".mycourses").addEventListener("click",function(){
    window.location.href = "userDashboard.html"
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
    const courses = await axios.get("http://localhost:3000/course/preview")
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
        let desc = document.createElement("p")

        let divCreator = document.createElement("div");
        let username = document.createElement("p");
        let rating  = document.createElement("p")
        divCreator.classList.add("flex")

        let purchaseDiv = document.createElement("div");
        let price = document.createElement("price");
        let purchase = document.createElement("button");

        div.classList.add("course")

        title.innerHTML = courses[i].title
        desc.innerHTML = courses[i].description

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

        price.innerHTML = `₹${courses[i].price}`
        purchase.innerHTML = "Purchase"
        purchase.addEventListener("click",function(){
            purchaseCourse(courses[i]._id)
        })

        purchaseDiv.appendChild(price)
        purchaseDiv.appendChild(purchase)
        purchaseDiv.classList.add("purchaseDiv")

        div.appendChild(divImg)
        div.appendChild(title)
        div.appendChild(desc)
        div.appendChild(divCreator)
        div.appendChild(purchaseDiv)

        courseDiv.appendChild(div);
    }
}

async function purchaseCourse(courseID){
    try{
        const response = await axios.post("http://localhost:3000/course/purchase",{
            courseID
        },{
            headers:{
                token:localStorage.getItem("token")
            }
        })
        alert(response.data);
        window.location.href = "userDashboard.html"
    }catch(e){
        alert(e);
    }
}