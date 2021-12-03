//import { Injectable } from '@angular/core';

//@Injectable({
//  providedIn: 'root'
//})
//export class InterviewQuestionService {

//  constructor() { }
//}

//---------------------------------------------------------------------------------------------------------------------
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Question } from '../group-interview/question';

@Injectable()
export class InterviewQuestionService {

  status: string[] = ['OUTOFSTOCK', 'INSTOCK', 'LOWSTOCK'];

  questionNames: string[] = [
    "Bamboo Watch",
    "Black Watch",
    "Blue Band",
    "Blue T-Shirt",
    "Bracelet",
    "Brown Purse",
    "Chakra Bracelet",
    "Galaxy Earrings",
    "Game Controller",
    "Gaming Set",
    "Gold Phone Case",
    "Green Earbuds",
    "Green T-Shirt",
    "Grey T-Shirt",
    "Headphones",
    "Light Green T-Shirt",
    "Lime Band",
    "Mini Speakers",
    "Painted Phone Case",
    "Pink Band",
    "Pink Purse",
    "Purple Band",
    "Purple Gemstone Necklace",
    "Purple T-Shirt",
    "Shoes",
    "Sneakers",
    "Teal T-Shirt",
    "Yellow Earbuds",
    "Yoga Mat",
    "Yoga Set",
  ];

  constructor(private http: HttpClient) { }

  getQuestionsSmall() {
    return this.http.get<any>('../../assets/questions-data.json')
      .toPromise()
      .then(res => <Question[]>res.data)
      .then(data => { return data; });
  }

  getQuestions() {
    return this.http.get<any>('../../assets/questions-data.json')
      .toPromise()
      .then(res => <Question[]>res.data)
      .then(data => { return data; });
  }

  getQuestionsWithOrdersSmall() {
    return this.http.get<any>('assets/products-orders-small.json')
      .toPromise()
      .then(res => <Question[]>res.data)
      .then(data => { return data; });
  }

  generateQuestion(): Question {
    const question: Question = {
      id: this.generateId(),
      name: this.generateName(),
      description: "Question Description",
      price: this.generatePrice(),
      quantity: this.generateQuantity(),
      category: "Question Category",
      inventoryStatus: this.generateStatus(),
      rating: this.generateRating()
    };

    question.image = question.name.toLocaleLowerCase().split(/[ ,]+/).join('-') + ".jpg";
    return question;
  }

  generateId() {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  generateName() {
    return this.questionNames[Math.floor(Math.random() * Math.floor(30))];
  }

  generatePrice() {
    return Math.floor(Math.random() * Math.floor(299) + 1);
  }

  generateQuantity() {
    return Math.floor(Math.random() * Math.floor(75) + 1);
  }

  generateStatus() {
    return this.status[Math.floor(Math.random() * Math.floor(3))];
  }

  generateRating() {
    return Math.floor(Math.random() * Math.floor(5) + 1);
  }
}
