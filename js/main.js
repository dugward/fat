import {
  oscarList,
  shortsList,
  globesList,
  predictList,
  fiftyList,
  spiritsList,
  sagList,
  baftaList,
  unionList,
  lastList,
} from "./lists.js";

console.log(unionList);

history.pushState(null, null, null);
var pageState = 0;

var firebaseConfig = {
  apiKey: "AIzaSyCDObBl4mknVHOzlkaDLAPslVkKNngS8-s",
  authDomain: "d-fat-92801.firebaseapp.com",
  projectId: "d-fat-92801",
  storageBucket: "d-fat-92801.appspot.com",
  messagingSenderId: "724911341517",
  appId: "1:724911341517:web:832f3e98e0d5f5662bce84",
  measurementId: "G-R29SVRPRC7",
};

firebase.initializeApp(firebaseConfig);
firebase.analytics();
var db = firebase.firestore();
var anonCount = 0;
function emptyLocal() {
  var empty = [];
  localStorage.setItem("watched", JSON.stringify(empty));
  local = [];
}

if (JSON.parse(localStorage.getItem("watched")) == null) {
  emptyLocal();
}

if (JSON.parse(localStorage.getItem("anoncount")) == null) {
  localStorage.setItem("anoncount", JSON.stringify(0));
}

// functions for flashing the login button

function onState() {
  document.getElementById("loginButton").style.backgroundColor =
    "rgb(175, 211, 175)";
}
function offState() {
  document.getElementById("loginButton").style.backgroundColor = "";
}

//what to do on page load

document.addEventListener("DOMContentLoaded", () => {
  for (let i = 900; i < 4000; i = i + 900) {
    setTimeout(onState, i);
    setTimeout(offState, i + 450);
  }
});

//The login button
var provider = new firebase.auth.GoogleAuthProvider();

//Close the popup

document
  .getElementsByClassName("close")[0]
  .addEventListener("click", function () {
    document.getElementById("loginWarning").style.display = "none";
  });

// const signOut = firebase.auth().signOut();

const loggo = document.getElementById("loginButton");

var local = JSON.parse(localStorage.getItem("watched"));

var userInfo;
var userID;
var userName;
var userDoc;
var dbWatched = [];
var photoUrl;
var loggedIn = 0;

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    document.getElementById("spinner").style.display = "block";
    loggo.classList.add("clicked");
    loggo.classList.remove("unclicked");
    loggo.innerText = "Logout";
    loggedIn = 1;
    console.log("signed in");
    userInfo = firebase.auth().currentUser;
    // console.log(userInfo);
    userID = userInfo.uid;
    // console.log(userID);
    userName = userInfo.displayName;
    photoUrl = userInfo.photoURL;
    console.log(userName);
    userDoc = db.collection("users").doc(userID);
    userDoc.get().then(function (doc) {
      if (doc.exists) {
        dbWatched = doc.data().watched;

        if (local.length >= 1) {
          var comboList = local.concat(dbWatched);
          var filteredCombo = comboList.filter(
            (value, index) => comboList.indexOf(value) === index
          );
          userDoc.set(
            {
              watched: filteredCombo,
            },
            { merge: true }
          );
          dbWatched = filteredCombo;
        } else {
        }
      } else {
        if (local.length >= 1) {
          userDoc.set({
            watched: local,
            name: userName,
          });
        } else {
          db.collection("users").doc(userID).set({
            watched: [],
            name: userName,
          });
        }
      }
      document.getElementById("spinner").style.display = "none";
      putUpPosters();
      document.getElementsByClassName(
        "profilePic"
      )[0].innerHTML = `<img src="${photoUrl}" alt="profile pic" class="profilePicture">`;
      console.log(doc.data());
    });
  } else {
    loggo.classList.add("unclicked");
    loggo.classList.remove("clicked");
    loggo.innerText = "Login";
    loggedIn = 0;
    console.log("signed out");
    putUpPosters();
    document.getElementsByClassName("profilePic")[0].innerHTML = "";
  }
});
var explain = 0;

document.getElementById("listexplain").addEventListener("click", function () {
  if (explain == 0) {
    document.getElementById("listExplain").style.display = "block";
    explain = 1;
  } else {
    document.getElementById("listExplain").style.display = "none";
    explain = 0;
  }
});

loggo.addEventListener("click", function () {
  if (loggedIn == 1) {
    firebase.auth().signOut();
    emptyLocal();
    dbWatched = [];
  } else {
    firebase.auth().signInWithRedirect(provider);
  }
});
window.addEventListener("popstate", function () {
  if (pageState == 1) {
    backToMovies();
  }
});
document.getElementById("title").addEventListener("click", function () {
  if (pageState == 1) {
    backToMovies();
  }
});

var leaders = document.getElementById("leaders");
var leaderslink = document.getElementById("leaderlink");
var sweep = document.getElementsByClassName("sweep");

function backToMovies() {
  leaders.style.display = "none";
  leaderslink.classList.remove("open");
  leaderslink.classList.add("closed");
  document.getElementById("userList").innerHTML = "";
  leaderslink.innerText = "The Leader Board";
  for (let i = 0; i < sweep.length; i++) {
    sweep[i].style.display = "block";
  }
  pageState = 0;
  history.pushState(null, null, null);
}
leaderslink.addEventListener("click", function () {
  if (leaderslink.classList.contains("closed") == true) {
    leaders.style.display = "block";
    leaderslink.classList.remove("closed");
    leaderslink.classList.add("open");
    leaderslink.innerText = "Back";
    for (let i = 0; i < sweep.length; i++) {
      sweep[i].style.display = "none";
    }
    pageState = 1;
    history.replaceState(null, null, null);
    document.getElementById("title").style.cursor = "pointer";
    //update leadcers bars

    //
    // document.getElementById(
    //   "predictList"
    // ).innerHTML = `<div class="row leadersTitle">Predicts</div>`;
    // //
    // db.collection("users")
    //   .orderBy("predict", "desc")
    //   .get()
    //   .then(function (x) {
    //     x.forEach(function (doc) {
    //       var userData = doc.data();

    //       document.getElementById("predictList").insertAdjacentHTML(
    //         "beforeend",
    //         `            <div class="row leaderrow">
    //                     <div class="leadername ${userData.name}"  id="${doc.id}"><a  >${userData.name}</a></div>
    //                     <div class="myProgress leaderbar">
    //                       <div class="myBar" style="width:${userData.predict}%;">${userData.predict}%</div>
    //                     </div>
    //                   </div>`
    //       );
    //     });
    //   });
    //
    document.getElementById(
      "oscarList"
    ).innerHTML = `<div class="row leadersTitle">Early Predicts</div>`;
    //
    db.collection("users")
      .orderBy("twentytwo", "desc")
      .get()
      .then(function (x) {
        x.forEach(function (doc) {
          var userData = doc.data();

          document.getElementById("oscarList").insertAdjacentHTML(
            "beforeend",
            `            <div class="row leaderrow">
                        <div class="leadername ${userData.name}"  id="${doc.id}"><a  >${userData.name}</a></div>
                        <div class="myProgress leaderbar">
                          <div class="myBar" style="width:${userData.twentytwo}%;">${userData.twentytwo}%</div>
                        </div>
                      </div>`
          );
        });
      });

    // document.getElementById(
    //   "shortsList"
    // ).innerHTML = `<div class="row leadersTitle">Shorts</div>`;
    // //
    // db.collection("users")
    //   .orderBy("shorts", "desc")
    //   .get()
    //   .then(function (x) {
    //     x.forEach(function (doc) {
    //       var userData = doc.data();

    //       document.getElementById("shortsList").insertAdjacentHTML(
    //         "beforeend",
    //         `            <div class="row leaderrow">
    //                       <div class="leadername ${userData.name}"  id="${doc.id}"><a  >${userData.name}</a></div>
    //                       <div class="myProgress leaderbar">
    //                         <div class="myBar" style="width:${userData.shorts}%;">${userData.shorts}%</div>
    //                       </div>
    //                     </div>`
    //       );
    //     });
    //   });

    // document.getElementById(
    //   "globesList"
    // ).innerHTML = `<div class="row leadersTitle">Globes</div>`;
    // //
    // db.collection("users")
    //   .orderBy("globes", "desc")
    //   .get()
    //   .then(function (x) {
    //     x.forEach(function (doc) {
    //       var userData = doc.data();
    //       document.getElementById("globesList").insertAdjacentHTML(
    //         "beforeend",
    //         `            <div class="row leaderrow">
    //                     <div class="leadername ${userData.name}"  id="${doc.id}"><a  >${userData.name}</a></div>
    //                     <div class="myProgress leaderbar">
    //                       <div class="myBar" style="width:${userData.globes}%;">${userData.globes}%</div>
    //                     </div>
    //                   </div>`
    //       );
    //     });
    //   });

    // //
    // document.getElementById(
    //   "spiritsList"
    // ).innerHTML = `<div class="row leadersTitle">Spirits</div>`;
    // //
    // db.collection("users")
    //   .orderBy("spirits", "desc")
    //   .get()
    //   .then(function (x) {
    //     x.forEach(function (doc) {
    //       var userData = doc.data();
    //       document.getElementById("spiritsList").insertAdjacentHTML(
    //         "beforeend",
    //         `            <div class="row leaderrow">
    //                       <div class="leadername ${userData.name}"  id="${doc.id}" ><a>${userData.name}</a></div>
    //                       <div class="myProgress leaderbar">
    //                         <div class="myBar" style="width:${userData.spirits}%;">${userData.spirits}%</div>
    //                       </div>
    //                     </div>`
    //       );
    //     });
    //   });
    // //

    // document.getElementById(
    //   "sagList"
    // ).innerHTML = `<div class="row leadersTitle">SAGs</div>`;
    // //
    // db.collection("users")
    //   .orderBy("sag", "desc")
    //   .get()
    //   .then(function (x) {
    //     x.forEach(function (doc) {
    //       var userData = doc.data();
    //       document.getElementById("sagList").insertAdjacentHTML(
    //         "beforeend",
    //         `            <div class="row leaderrow">
    //                       <div class="leadername ${userData.name}"  id="${doc.id}" ><a>${userData.name}</a></div>
    //                       <div class="myProgress leaderbar">
    //                         <div class="myBar" style="width:${userData.sag}%;">${userData.sag}%</div>
    //                       </div>
    //                     </div>`
    //       );
    //     });
    //   });
    // //
    // document.getElementById(
    //   "baftaList"
    // ).innerHTML = `<div class="row leadersTitle">BAFTAs <a id="shortsBafta">(remove shorts)</a><a id="backBafta" style="display:none">(add shorts)</a></div>`;
    // //
    // db.collection("users")
    //   .orderBy("bafta", "desc")
    //   .get()
    //   .then(function (x) {
    //     x.forEach(function (doc) {
    //       var userData = doc.data();
    //       document.getElementById("baftaList").insertAdjacentHTML(
    //         "beforeend",
    //         `            <div class="row leaderrow">
    //                       <div class="leadername ${userData.name}"  id="${doc.id}" ><a>${userData.name}</a></div>
    //                       <div class="myProgress leaderbar">
    //                         <div class="myBar bafta" style="width:${userData.bafta}%;">${userData.bafta}%</div>
    //                       </div>
    //                     </div>`
    //       );
    //     });
    //   })
    //   .then(
    //     document.querySelector("#shortsBafta").addEventListener("click", () => {
    //       let bars = document.querySelectorAll(".mybar,.bafta");
    //       bars.forEach((el) => {
    //         let perc1 = el.innerText.slice(0, -1);
    //         let perc = perc1 / 100;
    //         console.log(perc);
    //         let numWatched = Math.round(perc * baftaList.length);
    //         console.log(numWatched);
    //         let newPer = Math.round(
    //           (numWatched / (baftaList.length - 8)) * 100
    //         );
    //         console.log(newPer);
    //         el.style.width = `${newPer}%`;
    //         el.innerText = `${newPer}%`;
    //         document.querySelector("#shortsBafta").style.display = "none";
    //         document.querySelector("#backBafta").style.display = "inline";

    //         //
    //       });
    //     })
    //   )
    //   .then(
    //     document.querySelector("#backBafta").addEventListener("click", () => {
    //       let bars = document.querySelectorAll(".mybar,.bafta");
    //       bars.forEach((el) => {
    //         let perc1 = el.innerText.slice(0, -1);
    //         let perc = perc1 / 100;
    //         console.log(perc);
    //         let numWatched = Math.round(perc * (baftaList.length - 8));
    //         console.log(numWatched);
    //         let newPer = Math.round((numWatched / baftaList.length) * 100);
    //         console.log(newPer);
    //         el.style.width = `${newPer}%`;
    //         el.innerText = `${newPer}%`;
    //         document.querySelector("#backBafta").style.display = "none";
    //         document.querySelector("#shortsBafta").style.display = "inline";
    //         //
    //       });
    //     })
    //   );
    // //
    // document.getElementById(
    //   "fiftyList"
    // ).innerHTML = `<div class="row leadersTitle">Best 50</div>`;
    // //
    // db.collection("users")
    //   .orderBy("fifty", "desc")
    //   .get()
    //   .then(function (x) {
    //     x.forEach(function (doc) {
    //       var userData = doc.data();
    //       document.getElementById("fiftyList").insertAdjacentHTML(
    //         "beforeend",
    //         `            <div class="row leaderrow">
    //                     <div class="leadername ${userData.name}"  id="${doc.id}" ><a>${userData.name}</a></div>
    //                     <div class="myProgress leaderbar">
    //                       <div class="myBar" style="width:${userData.fifty}%;">${userData.fifty}%</div>
    //                     </div>
    //                   </div>`
    //       );
    //     });
    //   });
    // document.getElementById(
    //   "unionList"
    // ).innerHTML = `<div class="row leadersTitle">∩ List</div>`;
    // db.collection("users")
    //   .orderBy("union", "desc")
    //   .get()
    //   .then(function (x) {
    //     x.forEach(function (doc) {
    //       var userData = doc.data();

    //       document.getElementById("unionList").insertAdjacentHTML(
    //         "beforeend",
    //         `            <div class="row leaderrow">
    //                     <div class="leadername ${userData.name}"  id="${doc.id}"><a  >${userData.name}</a></div>
    //                     <div class="myProgress leaderbar">
    //                       <div class="myBar" style="width:${userData.union}%;">${userData.union}%</div>
    //                     </div>
    //                   </div>`
    //       );
    //     });
    //   });

    document.getElementById(
      "lastList"
    ).innerHTML = `<div class="row leadersTitle">2021 List</div>`;
    db.collection("users")
      .orderBy("twentyone", "desc")
      .get()
      .then(function (x) {
        x.forEach(function (doc) {
          var userData = doc.data();

          document.getElementById("lastList").insertAdjacentHTML(
            "beforeend",
            `            <div class="row leaderrow">
                          <div class="leadername ${userData.name}"  id="${doc.id}"><a  >${userData.name}</a></div>
                          <div class="myProgress leaderbar">
                            <div class="myBar" style="width:${userData.twentyone}%;">${userData.twentyone}%</div>
                          </div>
                        </div>`
          );
        });
      });

    db.collection("users")
      .orderBy("fifty", "desc")
      .get()
      .then(function (x) {
        nameLinks();
      });

    function nameLinks() {
      var leadernames = document.querySelectorAll(".leadername");
      for (let i = 0; i < leadernames.length; i++) {
        leadernames[i].addEventListener("click", function () {
          //
          //
          console.log(leadernames[i].id);
          document.getElementById("leaders").style.display = "none";
          var userlist = document.getElementById("userList");
          userlist.style.display = "block";
          userlist.innerHTML = `<div class="userlistname">${leadernames[i].classList[1]} has watched:</div>`;
          db.collection("users")
            .doc(leadernames[i].id)
            .get()
            .then(function (doc) {
              //
              var userwatched = doc.data().watched;
              userwatched.forEach((el) => {
                const fetchPromise = fetch(
                  `https://api.themoviedb.org/3/movie/${el}?api_key=b737a09f5864be7f9f38f1d5ad71c151&language=en-US`
                );
                fetchPromise
                  .then((response) => {
                    return response.json();
                  })
                  .then((details) => {
                    if (details.poster_path !== null) {
                      var poster = `https://image.tmdb.org/t/p/w500${details.poster_path}`;
                    } else {
                      var poster = `images/noposter.jpg`;
                    }
                    let id = details.id;
                    let title = details.original_title;

                    var h = document.getElementById("userList");
                    h.insertAdjacentHTML(
                      "beforeend",
                      `<div class="movie"  id="${id}">
                    <img src=${poster} alt="${title}" id="poster" class="image"/> <span class="material-icons circlecheck">
                    check_circle_outline
                    </span><div class="movieTitle"><a href="https://www.themoviedb.org/movie/${id}">${title}</a></div>
                    </div>`
                    );
                  });
              });

              //
            });
        });
      }
    }

    // The user's list page

    //
  } else {
    backToMovies();
  }
});

window.addEventListener("popstate", function () {
  if (pageState == 1) {
    backToMovies();
  }
});

// Here is our list made by toggling buttons

var toggleList = [];

// console.log(toggleList);

//Make the check buttons listen for a click, then if they are not clicked, add 'checked' to class list. If they are not, remove checked.

var checks = document.querySelectorAll(".list");

for (let i = 0; i < checks.length; i++) {
  checks[i].addEventListener("click", () => {
    if (checks[i].classList.contains("checked") == true) {
      if (checks[i].classList.contains("morelist") == true) {
        checks[i].classList.remove("checked");
        var checkmark = checks[i].getElementsByClassName("material-icons");
        checkmark[0].style.display = "none";

        document.getElementById("more").classList.remove("checked");
        document
          .getElementById("more")
          .getElementsByClassName("material-icons")[0].style.display = "none";
        putUpPosters();
      } else {
        checks[i].classList.remove("checked");
        var checkmark = checks[i].getElementsByClassName("material-icons");
        checkmark[0].style.display = "none";
        putUpPosters();
      }
    } else {
      if (checks[i].classList.contains("morelist") == true) {
        checks[i].insertAdjacentHTML(
          "afterbegin",
          `<span class="material-icons">
            done 
            </span> `
        );
        checks[i].classList.add("checked");
        document.getElementById("more").insertAdjacentHTML(
          "afterbegin",
          `<span class="material-icons">
                done 
                </span> `
        );
        document.getElementById("more").classList.add("checked");
        putUpPosters();
      } else {
        checks[i].classList.add("checked");
        checks[i].insertAdjacentHTML(
          "afterbegin",
          `<span class="material-icons">
            done 
            </span> `
        );
        putUpPosters();
      }
    }
  });
}
//Function for clearing the movies div
function clearMovies() {
  document.getElementById("movies").innerHTML = "";
}

//Putting up the posters giant function

function putUpPosters() {
  //   console.log(`At poster putup, dbWatched=${dbWatched} `);
  //Check for checked in buttons and if there, add their list to toggleList

  var checked = document.querySelectorAll(".checked");
  toggleList = [];
  var displayList = [];
  clearMovies();
  //console.log(checked.length);

  for (let i = 0; i < checked.length; i++) {
    // if (checked[i].id == "predict") {
    //   toggleList = toggleList.concat(predictList);
    // }
    if (checked[i].id == "oscar") {
      toggleList = toggleList.concat(oscarList);
    }
    if (checked[i].id == "shorts") {
      toggleList = toggleList.concat(shortsList);
    }
    if (checked[i].id == "globes") {
      toggleList = toggleList.concat(globesList);
    }

    if (checked[i].id == "spirits") {
      toggleList = toggleList.concat(spiritsList);
    }
    if (checked[i].id == "sag") {
      toggleList = toggleList.concat(sagList);
    }
    if (checked[i].id == "bafta") {
      toggleList = toggleList.concat(baftaList);
    }
    if (checked[i].id == "fifty") {
      toggleList = toggleList.concat(fiftyList);
    }
    if (checked[i].id == "union") {
      toggleList = toggleList.concat(unionList);
    }
    if (checked[i].id == "last") {
      toggleList = toggleList.concat(lastList);
    }

    //Cut out the dupes
    displayList = toggleList.filter(
      (value, index) => toggleList.indexOf(value) === index
    );
    //console.log(displayList);
  }
  var bar = document.getElementsByClassName("myBar");
  function updateBar() {
    if (loggedIn == 1) {
      if (typeof dbWatched == "undefined") {
        var y = 0;
      } else {
        var y = dbWatched.filter((element) => displayList.includes(element));
      }
    } else {
      var y = local.filter((element) => displayList.includes(element));
    }

    var watchedRatio = Math.round((y.length / displayList.length) * 100);

    if (isNaN(watchedRatio) == false) {
      bar[0].style.width = `${watchedRatio}%`;
      bar[0].innerHTML = `${watchedRatio}%&nbsp;&nbsp;&nbsp;&nbsp;${y.length}/${displayList.length}`;
    } else {
      bar[0].innerText = "0%";
      bar[0].style.width = "0%";
    }
  }

  //put the poster into the div
  if (displayList.length >= 1) {
    for (let i = 0; i < displayList.length; i++) {
      const fetchPromise = fetch(
        `https://api.themoviedb.org/3/movie/${displayList[i]}?api_key=b737a09f5864be7f9f38f1d5ad71c151&language=en-US`
      );
      fetchPromise
        .then((response) => {
          return response.json();
        })
        .then((details) => {
          if (details.poster_path !== null) {
            var poster = `https://image.tmdb.org/t/p/w500${details.poster_path}`;
          } else {
            var poster = `images/noposter.jpg`;
          }
          let id = details.id;
          let title = details.title;

          //   console.log(poster);
          //   console.log(id);
          var h = document.getElementById("movies");
          if (loggedIn == 1) {
            if (typeof dbWatched == "undefined") {
              var x = [];
            } else {
              var x = dbWatched;
            }
          } else {
            if (typeof local == "undefined") {
              var x = [];
            } else {
              var x = local;
            }
          }
          if (x.includes(id) == true) {
            h.insertAdjacentHTML(
              "beforeend",
              `<div class="movie seen"  id="${id}">
                    <img src=${poster} a alt="${title}" id="poster" class="image"/> <span class="material-icons circlecheck">
                    check_circle_outline
                    </span><div class="movieTitle"><a href="https://www.themoviedb.org/movie/${id}">${title}</a></div>
                    </div>`
            );
          } else {
            h.insertAdjacentHTML(
              "beforeend",
              `<div class="movie unseen"  id="${id}">
                    <img src=${poster} a alt="${title}" id="poster" class="image"/> <span class="material-icons circlecheck">
                    check_circle_outline
                    </span><div class="movieTitle"><a href="https://www.themoviedb.org/movie/${id}">${title}</a></div>
                    </div>`
            );
          }

          updateBar();

          var j = h.lastElementChild;

          j.getElementsByClassName("image")[0].addEventListener(
            "click",
            function () {
              if (j.classList.contains("unseen") == true) {
                j.classList.remove("unseen");
                j.classList.add("seen");
                if (loggedIn == 1) {
                  // console.log(parseInt(j.id, 10));
                  // console.log(dbWatched);
                  dbWatched = dbWatched.concat(parseInt(j.id, 10));
                  userDoc.set(
                    {
                      watched: dbWatched,
                    },
                    { merge: true }
                  );
                } else {
                  var anoncount = JSON.parse(localStorage.getItem("anoncount"));
                  anoncount++;
                  if (anoncount == 2) {
                    document.getElementById("loginWarning").style.display =
                      "block";
                    localStorage.setItem("anoncount", JSON.stringify(3));
                  } else {
                    localStorage.setItem(
                      "anoncount",
                      JSON.stringify(anoncount)
                    );
                  }
                }
                local.push(parseInt(j.id, 10));
                localStorage.setItem("watched", JSON.stringify(local));
              } else {
                j.classList.remove("seen");
                j.classList.add("unseen");

                if (loggedIn == 1) {
                  var index = dbWatched.indexOf(parseInt(j.id, 10));
                  dbWatched.splice(index, 1);
                  userDoc.set(
                    {
                      watched: dbWatched,
                    },
                    { merge: true }
                  );
                } else {
                  var index = local.indexOf(parseInt(j.id, 10));
                  if (index > -1) {
                    local.splice(index, 1);
                    localStorage.setItem("watched", JSON.stringify(local));
                  }
                }
              }
              updateBar();

              //leaders bars
              //create ratios and store
              if (loggedIn == 1) {
                // var predictMatch = dbWatched.filter((element) =>
                //   predictList.includes(element)
                // );
                // var predictRatio = Math.round(
                //   (100 * predictMatch.length) / predictList.length
                // );
                var shortsMatch = dbWatched.filter((element) =>
                  shortsList.includes(element)
                );
                var shortsRatio = Math.round(
                  (100 * shortsMatch.length) / shortsList.length
                );
                var oscarMatch = dbWatched.filter((element) =>
                  oscarList.includes(element)
                );
                var oscarRatio = Math.round(
                  (100 * oscarMatch.length) / oscarList.length
                );
                var globesMatch = dbWatched.filter((element) =>
                  globesList.includes(element)
                );
                var globesRatio = Math.round(
                  (100 * globesMatch.length) / globesList.length
                );
                var spiritsMatch = dbWatched.filter((element) =>
                  spiritsList.includes(element)
                );
                var spiritsRatio = Math.round(
                  (100 * spiritsMatch.length) / spiritsList.length
                );
                var sagMatch = dbWatched.filter((element) =>
                  sagList.includes(element)
                );
                var sagRatio = Math.round(
                  (100 * sagMatch.length) / sagList.length
                );
                var baftaMatch = dbWatched.filter((element) =>
                  baftaList.includes(element)
                );
                var baftaRatio = Math.round(
                  (100 * baftaMatch.length) / baftaList.length
                );
                var fiftyMatch = dbWatched.filter((element) =>
                  fiftyList.includes(element)
                );
                var fiftyRatio = Math.round(
                  (100 * fiftyMatch.length) / fiftyList.length
                );

                var unionMatch = dbWatched.filter((element) =>
                  unionList.includes(element)
                );
                var unionRatio = Math.round(
                  (100 * unionMatch.length) / unionList.length
                );

                var lastMatch = dbWatched.filter((element) =>
                  lastList.includes(element)
                );
                var lastRatio = Math.round(
                  (100 * lastMatch.length) / lastList.length
                );

                userDoc.set(
                  {
                    // predict: predictRatio,
                    twentytwo: oscarRatio,
                    shorts: shortsRatio,
                    globes: globesRatio,
                    spirits: spiritsRatio,
                    sag: sagRatio,
                    bafta: baftaRatio,
                    fifty: fiftyRatio,
                    union: unionRatio,
                    twentyone: lastRatio,
                  },
                  { merge: true }
                );
              }
            }
          );
        });
    }
  }
  //or clear the div if nothing is checked
  else {
    clearMovies();
    bar[0].style.width = "0%";
    bar[0].innerText = "0%";
  }
}
