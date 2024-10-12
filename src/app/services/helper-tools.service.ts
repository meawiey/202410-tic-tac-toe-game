import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, onSnapshot, updateDoc } from "firebase/firestore";

import { firebaseConfig } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HelperToolsService {
  public app = initializeApp(firebaseConfig);
  public auth = getAuth(this.app);
  public db = getFirestore(this.app);

  public userData: any;
  public userScore: any;


  constructor(public router: Router) {
    this.app = initializeApp(firebaseConfig);
    this.auth = getAuth(this.app);
  }

  // automatic resize game
  public resizeElement() {
    // getsize device
    const deviceW = window.innerWidth;
    const deviceH = window.innerHeight;
    // size need to change
    let currentW;
    let currentH;
    // parameter get element
    const getElementTopArea = document.getElementsByName('halfTop');
    const getElementGameArea = document.getElementsByName('idGameArea');
    const getElementBottomArea = document.getElementsByName('halfBottom');

    // this.maxSizeW = deviceW;
    for (let countloop = 0; countloop < getElementTopArea.length; countloop++) {
      currentH = Math.ceil(deviceW * 3 / 2);
      if (currentH <= deviceH) { // 100% width
        getElementGameArea[countloop].setAttribute('style', 'width:' + deviceW + 'px;height:' + currentH + 'px;margin: auto;');
        const hSpace = deviceH - currentH;
        if (hSpace > 1) {
          const hSpaceX = Math.floor(hSpace / 2);
          getElementTopArea[countloop].setAttribute('style', 'width:' + deviceW + 'px;height:' + hSpaceX + 'px;');
          getElementBottomArea[countloop].setAttribute('style', 'width:' + deviceW + 'px;height:' + hSpaceX + 'px;');
        }
      } else { // 100% height
        currentW = Math.ceil(deviceH * 2 / 3);
        const wSpace = deviceW - currentW;
        if (wSpace > 1) {
          const wSpaceX = Math.floor(wSpace / 2);
          getElementGameArea[countloop].setAttribute('style', 'width:' + currentW + 'px;height:' + deviceH + 'px;margin: auto;');
          getElementTopArea[countloop].style.visibility = 'hidden';
          getElementBottomArea[countloop].style.visibility = 'hidden';
        }
      }
    }
  }

  public getCurrentLogin() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.userData = user;
        this.getDataFromFirestore(this.userData.email);
      } else {
        this.router.navigate(['/home'])
      }
    });
  }

  public getDataFromFirestore(email: string) {
    const unsub = onSnapshot(doc(this.db, "customer", email), (doc) => {
      this.userScore = doc.data();
    });
  }

  public async updateScore(score: number, stack: number) {
    const updateScoreDetail = doc(this.db, "customer", this.userData.email);

    await updateDoc(updateScoreDetail, {
      score,
      stack
    });
  }

  public registerNewCustomer(email: string, password: string) {
    // Signed up 
    createUserWithEmailAndPassword(this.auth, email, password)
      .then(async (userCredential) => {
        // create database for this customer
        await setDoc(doc(this.db, "customer", email), {
          score: 0,
          stack: 0,
        });
        alert("Register Success");
        this.router.navigate(['/home']);
      })
      .catch((error) => {
        alert(this.mappErrorMessage(error.code));
      });
  }

  public loginWithEmail(email: string, password: string) {
    signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        // Signed in 
        this.userData = userCredential.user;
        this.router.navigate(['/game']);
      })
      .catch((error) => {
        alert(this.mappErrorMessage(error.code));
      });
  }

  public logout() {
    signOut(this.auth).then(() => {
      // Sign-out successful.
      this.router.navigate(['/home']);
    }).catch((error) => {
      // An error happened.
    });
  }

  public mappErrorMessage(inputCode: string): string {
    let returnMessage = ""
    switch (inputCode) {
      case "auth/email-already-in-use":
        returnMessage = "This email already used"
        break;
      case "auth/invalid-credential":
        returnMessage = "Email or Password incorrect"
        break;


      default:
        returnMessage = "something went wrong !!!"
        break;
    }

    return returnMessage;
  }
}
