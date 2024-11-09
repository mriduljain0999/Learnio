let courseDiv = document.querySelector(".courses")

window.onload = function() {
    fetch();
};

document.querySelector(".allcourses").addEventListener("click",function(){
    window.location.href = "adminAll.html"
})

document.querySelector(".createCourse").addEventListener("click",function(){
    window.location.href = "create.html"
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
    const courses = await axios.get("http://localhost:3000/admin/course/bulk",{
        headers:{
            token:localStorage.getItem("token")
        }
    })
    render(courses.data);
}

function render(courses){
    courseDiv.innerHTML = "";
    console.log(courses)
    for(let i=0;i<courses.length;i++){
        let div = document.createElement("div");
        let title = document.createElement("h5");
        let desc = document.createElement("p");
        let price = document.createElement("p");
        let divImg = document.createElement("div")
        let divBtn = document.createElement("div")
        let img = document.createElement("img");
        let del = document.createElement("button")
        let edit = document.createElement("button")

        div.classList.add("course")

        title.innerHTML = courses[i].title
        desc.innerHTML = courses[i].description
        img.setAttribute("src",courses[i].imageURL)
        divImg.classList.add("courseImg")
        divImg.appendChild(img)
        price.innerHTML = `₹${courses[i].price}`

        del.innerHTML = "Delete"
        del.addEventListener("click", function() {
            deleteCourse(courses[i]._id);
        });
        
        edit.innerHTML = "Edit";
        edit.addEventListener("click", function() {
            editCourse(courses[i]._id,courses[i].imageURL);
        });
        
        divBtn.appendChild(del)
        divBtn.appendChild(edit)
        divBtn.appendChild(price)
        divBtn.classList.add("course-btn-div")

        div.appendChild(divImg)
        div.appendChild(title)
        div.appendChild(desc)
        div.appendChild(divBtn)

        courseDiv.appendChild(div);
    }
}

async function deleteCourse(courseID){
    try{
        const response = await axios.delete("http://localhost:3000/admin/course", {
            headers: {
                token: localStorage.getItem("token")
            },
            data: { courseID }
        });
        alert(response.data);
        fetch();
    }catch(e){
        alert(e);
    }
}
function editCourse(courseID,imageURL){
    localStorage.setItem("courseID",courseID)
    localStorage.setItem("imageURL",imageURL);
    window.location.href = "edit.html";
}