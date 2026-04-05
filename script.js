
document.addEventListener('DOMContentLoaded', ()=>{ // ensure anything runs after all contents are loaded
    const dom = {
        form:  document.getElementById('input_form'),
        input_text_box:  document.getElementById("input_text_box"),
        add_button:  document.getElementById("add_button"),
        pendingList:  document.querySelector(".pendingList"),
        completedList:  document.querySelector(".completedList"),
    };


    
    const savedPendingArr = JSON.parse(localStorage.getItem('taskArr')) || []; // if nothing saved, then an empty arr
    const savedCompletedArr = JSON.parse(localStorage.getItem('completedArr')) || [];

    // console.log("last saved data: ", savedPendingArr, typeof(savedPendingArr));
    // console.log("last saved completed: ", savedCompletedArr, typeof(savedPendingArr));


    // handling input form 
    dom.form.addEventListener('submit', (e) => {
        e.preventDefault(); // very important as it prevents page from loading. The Page reloads everytime the button of type="submit" click so its used

        const inputText = dom.input_text_box.value.trim(); //trim removes leading and trailing spaces
        dom.input_text_box.value = '';  //clear the box for new input;
        
        if(inputText == ''){
            alert(`Invalid Input \nDoing Nothing is not a Task`);
        }
        else{
            savedPendingArr.unshift(inputText);
            localStorage.setItem('taskArr', JSON.stringify(savedPendingArr)); // must stringify
            
            //add this new element Pending  on  UI;
            makeElement();
        }
    });




    // create the Pending task elements at load, of Saved Elements
    function makeElement(){
        dom.pendingList.innerHTML = ''; // to remove "No Task yet"

        const elementArr = savedPendingArr.map(
            arrItem =>{
                return `
                        <div class="taskItem">
                            <span class="pendingTaskText">${arrItem}</span>
                            <section class="buttonContainer">
                                <button class="complteButton" >Mark Completed</button>
                                <button class="deleteButton" >Delete Task</button>
                            </section>
                        </div>
                    `
            } );
        

        // now add the elements in the html
        for(let ele of elementArr){
            const temp = document.createElement('li');
            temp.classList.add(`task${elementArr.indexOf(ele)}`);
            temp.innerHTML = ele;
            dom.pendingList.appendChild(temp);

        }
    }

    // call make  func on load to add saved pending task on UI
    if(savedPendingArr.length != 0){
        makeElement(); 
    }





    // add completed task  to UI
    function addCompletedTask(){
        dom.completedList.innerHTML = '';  

        const elementArr = savedCompletedArr.map(
            arrItem => {
                    return `
                                <div class="conpletedItem">
                                    <span class="completedTaskText">${arrItem}</span>
                                    <div class="buttonContainer">
                                        <button class="pendingButton">Add to Pending</button>
                                        <button class="deleteButton">Delete Task</button>
                                    </div>
                                </div>
                            `
            }
        );

        // add tasks to UI
        for(let item of elementArr){
            const temp = document.createElement('li');
            temp.innerHTML = item;  
            dom.completedList.appendChild(temp);
        }
    }

    // call add completed func on load to add saved completed task on UI
    if(savedCompletedArr.length != 0){
        addCompletedTask();
    }




     // handling complete Button and Delete Click    on   PENDING  List
    dom.pendingList.addEventListener('click', (e)=>{ // event at list as cant apply event on dynamically created element.  pendinfList click listens to anywhere click in the list          .'.  if(click target contains(btn) is must  ) 
        const listItem = e.target.closest('li');
        const span = listItem.querySelector('.pendingTaskText');
        const task = span.textContent.trim();
        const index = savedPendingArr.indexOf(task);
        
        // handling Complete Btn click
        if(e.target.classList.contains('complteButton')){

            savedPendingArr.splice(index, 1);   //delete task from the pending arR
            makeElement(); // Refresh the pENDING Ui 
            localStorage.setItem('taskArr', JSON.stringify(savedPendingArr)); // update the saved Arr

            //add task to completed Array
            savedCompletedArr.unshift(task);  // add task to completed arr
            addCompletedTask();  // Refresh the Completed Ui
            localStorage.setItem('completedArr', JSON.stringify(savedCompletedArr));
        }   

        // handling  Delete  btn Click
        if(e.target.classList.contains('deleteButton')){

            listItem.remove();  // remove the parent li => Ui auto updated

            savedPendingArr.splice(index, 1);  // delete task from Arr  => Ui auto Updated
            localStorage.setItem('taskArr', JSON.stringify(savedPendingArr));  //update saved Completed Arr
        }

    });




    // handling Pending Button and delete Click     in   COMPLETED  list
    dom.completedList.addEventListener('click', (e)=>{ // using event Bubbling

        const listItem = e.target.closest('li'); // parent li of the clicked btn
        const span = listItem.querySelector('.completedTaskText');
        const task = span.textContent.trim();
        const index = savedCompletedArr.indexOf(task);

        
        // handling  Pending  Click
        if(e.target.classList.contains('pendingButton')){

            savedCompletedArr.splice(index, 1);   // removing task from  completed  Arr
            addCompletedTask();   // refresh  completed task on UI
            localStorage.setItem('completedArr', JSON.stringify(savedCompletedArr));

            savedPendingArr.unshift(task);  // add task to pending Arr
            makeElement();  // refresh  pending task on UI
            localStorage.setItem('taskArr', JSON.stringify(savedPendingArr));
        }

        // handling  Delete  Click
        if(e.target.classList.contains('deleteButton')){

            listItem.remove();  // the Ui is refreshed Automatically

            savedCompletedArr.splice(index, 1); // removing from saved arr.   no need to refresh Ui, its done automatically
            localStorage.setItem('completedArr', JSON.stringify(savedCompletedArr));
        }

    });


});