import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
var _ = require('lodash');
var xlsx = require('json-as-xlsx');

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  public sample_json: Object;
  public sample_output: string;
  public sample_name = 'MyExcelSheet_01';

  constructor(
    public navCtrl: NavController,
    public toastController: ToastController
  ) {
    // let newRes = JSON.parse(JSON.stringify(this.sample_event));
    // console.log(newRes);
  }
  async presentToast(message: string, duration: number) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration
    });
    toast.present();
    this.sample_output = '';
  }

  changed() {
    const __this = this;
    this.sample_output = '';
    let sample_json;
    let execute = true;
    console.log('changed');

    try {
      console.log('Json -> ' + this.toString(this.toJson(this.sample_json)));
      sample_json = this.toJson(this.sample_json);
    } catch (e) {
      console.log('JSON Format error ->> ', e);
      this.presentToast('JSON Format ERROR', 1000);
      execute = false;
    }

    if (execute) {
      try {
        let data = [
          {
            sheet: 'Adults',
            columns: [
              { label: 'User', value: 'user' }, // Top level data
              { label: 'Age', value: row => row.age + ' years' }, // Run functions
              {
                label: 'Phone',
                value: row => (row.more ? row.more.phone || '' : '')
              } // Deep props
            ],
            content: [
              { user: 'Andrea', age: 20, more: { phone: '11111111' } },
              { user: 'Luis', age: 21, more: { phone: '12345678' } }
            ]
          },
          {
            sheet: 'Children',
            columns: [
              { label: 'User', value: 'user' }, // Top level data
              { label: 'Age', value: row => row.age + ' years' }, // Run functions
              {
                label: 'Phone',
                value: row => (row.more ? row.more.phone || '' : '')
              } // Deep props
            ],
            content: [
              { user: 'Manuel', age: 16, more: { phone: '99999999' } },
              { user: 'Ana', age: 17, more: { phone: '87654321' } }
            ]
          }
        ];

        let settings = {
          fileName: this.sample_name, // Name of the spreadsheet
          extraLength: 3, // A bigger number means that columns will be wider
          writeOptions: {} // Style options from https://github.com/SheetJS/sheetjs#writing-options
        };

        xlsx(data, settings); // Will download the excel file
      } catch (e) {
        console.log('data processing error ->> ', e);
        setTimeout(function() {
          __this.presentToast('ERROR in data processing', 3000);
        }, 2000);
      }
    }
  }

  toJson(data: any) {
    return JSON.parse(data); /**convert text into a JavaScript object **/
  }

  toString(data: any) {
    return JSON.stringify(data); /**object to string **/
  }

  deepCopy(data: any) {
    return JSON.parse(JSON.stringify(data));
  }
}
