import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
const pako = require('pako');

@Component({
  selector: 'page-decoder',
  templateUrl: 'decoder.html'
})
export class DecoderPage {
  public sample_code: object;
  public sample_output: string;

  constructor(
    public navCtrl: NavController,
    public toastController: ToastController
  ) {}
  decode() {
    const __this = this;
    let encodedStr: Uint8Array;
    this.sample_output = '';

    try {
      encodedStr = this.toJson(this.sample_code);
      console.log('encodedStr', encodedStr);
    } catch (e) {
      console.log('request processing error ->> ', e);
      this.presentToast('JSON Format ERROR in encoded code', 2000);
    }
    try {
      let gzip = encodedStr;
      let byteArray = new Uint8Array(gzip);
      let inflatedStr = pako.inflate(byteArray, { to: 'string' });

      console.log('inflatedStr', inflatedStr);
      this.sample_output = this.deepCopy(inflatedStr);
    } catch (e) {
      console.log('data processing error ->> ', e);
      setTimeout(function() {
        __this.presentToast('ERROR in data processing', 3000);
      }, 1000);
    }
  }

  async presentToast(message: string, duration: number) {
    const toast = await this.toastController.create({
      message: message,
      duration: duration
    });
    toast.present();
    this.sample_output = '';
  }

  toString(data: any) {
    return JSON.stringify(data); /**object to string **/
  }

  toJson(data: any) {
    return JSON.parse(data); /**convert text into a JavaScript object **/
  }

  deepCopy(data: any) {
    return JSON.parse(JSON.stringify(data));
  }
}
