(function () {
  //clock

  let time = 0;
  let intervalID;
  let hour = document.getElementById("hr");
  let mins = document.getElementById("min");
  let secs = document.getElementById("sec");
  function timefnx() {
    time++;
    if (~~(time / 3600) < 10) {
      hour.innerText = `0${~~(time / 3600)}`;
    } else {
      hour.innerText = `${~~(time / 3600)}`;
    }
    if (~~(time / 60) % 60 < 10) {
      mins.innerText = `0${~~(time / 60) % 60}`;
    } else {
      mins.innerText = `${~~(time / 60) % 60}`;
    }
    if (time % 60 < 10) {
      secs.innerText = `0${time % 60}`;
    } else {
      secs.innerText = `${time % 60}`;
    }
  }

  //start button

  let start = document.getElementById("start");
  start.addEventListener("click", thestartGame);
  function thestartGame() {
    intervalID = setInterval(timefnx, 1000);
    document.getElementById("keypad").classList.remove("hide");
    start.removeEventListener("click", thestartGame);
  }

  //render the key pad and make the grid array

  let grid = [];
  for (let i = 0; i < 9; i++) {
    let arr = [];
    for (let j = 0; j < 9; j++) {
      arr.push(0);
    }
    grid.push(arr);
  }

  //plce the bombs

  let arr1 = [];
  for (let i = 0; i < 9; i++) {
    let val_j = Math.floor(Math.random() * 9);
    arr1.push(val_j);
    grid[i][val_j] = "b";
  }

  //increase the count of sorrounding elements

  for (let i = 0; i < 9; i++) {
    if (arr1[i] + 1 < 9 && grid[i][arr1[i] + 1] !== "b") {
      grid[i][arr1[i] + 1]++;
    }
    if (arr1[i] - 1 >= 0 && grid[i][arr1[i] - 1] !== "b") {
      grid[i][arr1[i] - 1]++;
    }
    if (i - 1 >= 0 && grid[i - 1][arr1[i]] !== "b") {
      grid[i - 1][arr1[i]]++;
    }
    if (i + 1 < 9 && grid[i + 1][arr1[i]] !== "b") {
      grid[i + 1][arr1[i]]++;
    }
    if (arr1[i] - 1 >= 0 && i - 1 >= 0 && grid[i - 1][arr1[i] - 1] !== "b") {
      grid[i - 1][arr1[i] - 1]++;
    }
    if (arr1[i] + 1 < 9 && i + 1 < 9 && grid[i + 1][arr1[i] + 1] !== "b") {
      grid[i + 1][arr1[i] + 1]++;
    }
    if (i - 1 >= 0 && arr1[i] + 1 < 9 && grid[i - 1][arr1[i] + 1] !== "b") {
      grid[i - 1][arr1[i] + 1]++;
    }
    if (i + 1 < 9 && arr1[i] - 1 >= 0 && grid[i + 1][arr1[i] - 1] !== "b") {
      grid[i + 1][arr1[i] - 1]++;
    }
  }

  console.log(grid);

  //render the key pad...

  let arr2 = [];
  let keypad_id = document.getElementById("keypad");
  for (let i = 0; i < 9; i++) {
    let array = [];
    let rowel = document.createElement("div");
    rowel.className = "rowe";
    for (let j = 0; j < 9; j++) {
      let obj = {};
      obj.open = false;
      obj.flag = false;
      obj.value = grid[i][j];
      array.push(obj);
      let cellel = document.createElement("button");
      cellel.setAttribute("id", i.toString() + j.toString());
      cellel.addEventListener("mousedown", (event) => handleclick(event, i, j));
      cellel.className = "celle";
      rowel.appendChild(cellel);
    }
    keypad_id.appendChild(rowel);
    arr2.push(array);
  }
  //console.log(arr2);

  //the clicking function

  let num_of_bombs = 9;
  let num_of_non_bombs = 0;
  function handleclick(event, i, j) {
    let cell_el = document.getElementById(i.toString() + j.toString());
    if (event.button === 0) {
      //reveal or gave over
      if (arr2[i][j].open === false && arr2[i][j].flag === false) {
        if (arr2[i][j].value === "b") {
          cell_el.innerHTML = "💣";
          cell_el.classList.add("click");
          arr2 = [];
          clearInterval(intervalID);
          setTimeout(() => {
            alert(`game over , refresh to restart`);
          }, 100);
          console.log("lost");
        } else {
          reveal(i, j);
        }
      }
    } else if (event.button === 2) {
      //flagging
      if (arr2[i][j].open === false && arr2[i][j].flag === false) {
        arr2[i][j].flag = true;
        cell_el.innerHTML = "🚩";
        console.log("flag is set");
        if (arr2[i][j].value === "b") {
          num_of_bombs--;
          if (num_of_bombs === 0 && num_of_non_bombs === 0) {
            clearInterval(intervalID);
            arr2 = [];
            setTimeout(() => {
              alert(
                `congratulation you finished in ${time} secs, refresh to restart`
              );
            }, 100);
            console.log("win");
          }
        } else {
          num_of_non_bombs++;
        }
      } else if (arr2[i][j].open === false && arr2[i][j].flag === true) {
        arr2[i][j].flag = false;
        cell_el.innerHTML = "";
        if (arr2[i][j].value === "b") {
          num_of_bombs++;
        } else {
          num_of_non_bombs--;
          if (num_of_bombs === 0 && num_of_non_bombs === 0) {
            clearInterval(intervalID);
            arr2 = [];
            setTimeout(() => {
              alert(
                `congratulation you finished in ${time} secs, refresh to restart`
              );
            }, 100);
            console.log("win");
          }
        }
      }
    }
  }

  // function for revealing

  function reveal(i, j) {
    if (arr2[i][j].flag === false) {
      let x = document.getElementById(i.toString() + j.toString());
      x.classList.add("click");
      x.innerHTML = `${arr2[i][j].value}`;
      arr2[i][j].open = true;
    }
  }
})();
