(function () {
  //initialisation of variables
  let isOver = false;
  let row;
  let column;
  let time = 0;
  let intervalID;
  let hour = document.getElementById("hr");
  let mins = document.getElementById("min");
  let secs = document.getElementById("sec");
  // function to handle time tags
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
  // functions to handle dimensions
  document.getElementById("rowCount").addEventListener("change", numChange1);
  document.getElementById("columnCount").addEventListener("change", numChange2);
  function numChange1() {
    return document.getElementById("rowCount").value;
  }
  function numChange2() {
    return document.getElementById("columnCount").value;
  }
  let start = document.getElementById("start");
  start.addEventListener("click", startGame);
  // function to initiate the game
  function startGame() {
    if (numChange1() === "" || numChange2() === "") {
      alert(`fill up the fields properly`);
    } else {
      start.removeEventListener("click", startGame);
      document.getElementById("rowCount").setAttribute("disabled", true);
      document.getElementById("columnCount").setAttribute("disabled", true);
      row = numChange1();
      column = numChange2();
      let grid = [];
      for (let i = 0; i < row; i++) {
        let arr = [];
        for (let j = 0; j < column; j++) {
          arr.push(0);
        }
        grid.push(arr);
      }
      let arr1 = [];
      for (let i = 0; i < row; i++) {
        let val_j = Math.floor(Math.random() * column);
        arr1.push(val_j);
        grid[i][val_j] = "b";
      }
      for (let i = 0; i < row; i++) {
        if (
          i - 1 >= 0 &&
          arr1[i] - 1 >= 0 &&
          grid[i - 1][arr1[i] - 1] !== "b"
        ) {
          grid[i - 1][arr1[i] - 1]++;
        }
        if (
          i + 1 < row &&
          arr1[i] + 1 < column &&
          grid[i + 1][arr1[i] + 1] !== "b"
        ) {
          grid[i + 1][arr1[i] + 1]++;
        }
        if (
          i + 1 < row &&
          arr1[i] - 1 >= 0 &&
          grid[i + 1][arr1[i] - 1] !== "b"
        ) {
          grid[i + 1][arr1[i] - 1]++;
        }
        if (
          i - 1 >= 0 &&
          arr1[i] + 1 < column &&
          grid[i - 1][arr1[i] + 1] !== "b"
        ) {
          grid[i - 1][arr1[i] + 1]++;
        }
        if (i - 1 >= 0 && grid[i - 1][arr1[i]] !== "b") {
          grid[i - 1][arr1[i]]++;
        }
        if (i + 1 < row && grid[i + 1][arr1[i]] !== "b") {
          grid[i + 1][arr1[i]]++;
        }
        if (arr1[i] - 1 >= 0 && grid[i][arr1[i] - 1] !== "b") {
          grid[i][arr1[i] - 1]++;
        }
        if (arr1[i] + 1 < column && grid[i][arr1[i] + 1] !== "b") {
          grid[i][arr1[i] + 1]++;
        }
      }
      //render the key pad...

      let arr2 = [];
      let keypad_id = document.getElementById("keypad");
      for (let i = 0; i < row; i++) {
        let array = [];
        let rowel = document.createElement("div");
        rowel.className = "rowe";
        for (let j = 0; j < column; j++) {
          let obj = {};
          obj.open = false;
          obj.flag = false;
          obj.value = grid[i][j];
          array.push(obj);
          let cellel = document.createElement("button");
          cellel.setAttribute("id", i.toString() + j.toString());
          cellel.addEventListener("mousedown", (event) =>
            handleclick(event, i, j)
          );
          cellel.className = "celle";
          rowel.appendChild(cellel);
        }
        keypad_id.appendChild(rowel);
        arr2.push(array);
      }
      //the clicking function

      let num_of_bombs = row;
      let num_of_non_bombs = 0;
      function handleclick(event, i, j) {
        if (!isOver) {
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
                  document.getElementById(
                    "losingStatus"
                  ).innerText = `Sorry, you lost 😖 `;
                  document.getElementById("lost").classList.remove("hide");
                  isOver = true;
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
                    document.getElementById(
                      "winningStatus"
                    ).innerText = `congratulations, you finished in ${time} secs 🤩 `;
                    document.getElementById("won").classList.remove("hide");
                    isOver = true;
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
                    document.getElementById(
                      "winningStatus"
                    ).innerText = `congratulations, you finished in ${time} secs 🤩 `;
                    document.getElementById("won").classList.remove("hide");
                    isOver = true;
                  }, 100);
                  console.log("win");
                }
              }
            }
          }
        }
      }

      // function for revealing blocks

      function reveal(i, j) {
        if (arr2[i][j].flag === false) {
          let x = document.getElementById(i.toString() + j.toString());
          x.classList.add("click");
          x.innerHTML = `${arr2[i][j].value}`;
          arr2[i][j].open = true;
        }
      }
      console.log(grid);
      intervalID = setInterval(timefnx, 1000);
    }
  }
})();

