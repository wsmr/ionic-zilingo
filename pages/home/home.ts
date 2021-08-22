import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
var _ = require('lodash');

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public sample_request: object;
  public sample_query: object;
  public sample_output: string;

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
    let sample_query: string;
    let sample_request: string;
    console.log('changed');

    try {
      console.log(
        'requests/req_args -> ' +
          this.toString(
            this.toJson(this.sample_request)['requests'][0]['req_args']
          )
      );
      sample_request = this.toJson(this.sample_request)['requests'][0][
        'req_args'
      ];
    } catch (e) {
      console.log('request processing error ->> ', e);
      this.presentToast('JSON Format ERROR in request', 1000);
    }

    try {
      console.log(
        'query -> ' + this.toString(this.toJson(this.sample_query)['query'])
      );
      sample_query = this.toString(this.toJson(this.sample_query)['query']);
      // if(_.has(sample_query, '_id')) {
      //   delete sample_query['_id'];
      // }

      // console.log(this.toJson(sample_query));
    } catch (e) {
      console.log('query processing error ->> ', e);
      setTimeout(function() {
        __this.presentToast('JSON Format ERROR in query', 1000);
      }, 1000);
    }

    try {
      _.forEach(sample_request, function(obj: { value: any; key: string }) {
        if (typeof obj.value === 'boolean') {
          sample_query = __this.replaceSpec(
            sample_query,
            obj.key,
            obj.value,
            'boolean'
          );
        } else if (Array.isArray(obj.value)) {
          sample_query = __this.replaceSpec(
            sample_query,
            obj.key,
            obj.value,
            'object'
          );
        } else sample_query = sample_query.replaceAll(obj.key, obj.value);
      });
      // sample_query.replace("@ds", "ds5");
      this.sample_output = this.deepCopy(sample_query);
    } catch (e) {
      console.log('data processing error ->> ', e);
      setTimeout(function() {
        __this.presentToast('ERROR in data processing', 3000);
      }, 2000);
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

  replaceSpec(query: string, key: string, value: any, type: string) {
    switch (type) {
      case 'boolean':
        console.log(
          '%c' + 'boolean',
          'color:blue; font-family:monospace',
          key,
          value
        );
        return query.replaceAll(key, value);
        break;
      case 'object':
        console.log(
          '%c' + 'object',
          'color:blue; font-family:monospace',
          key,
          value
        );
        let stringArr = '[' + value.toString() + ']';
        return query.replaceAll(key, stringArr);
        break;
      default:
        console.log('default');
    }
  }
}
