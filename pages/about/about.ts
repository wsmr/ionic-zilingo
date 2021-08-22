import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
var _ = require('lodash');

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {
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
    let collection: string;
    let query_type: string;

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
      console.log(
        'query collection -> ' +
          this.toString(this.toJson(this.sample_query)['collection'])
      );
      console.log(
        'query type -> ' +
          this.toString(this.toJson(this.sample_query)['query_type'])
      );
      sample_query = this.toJson(this.sample_query)['query'];
      collection = this.toJson(this.sample_query)['collection'];
      query_type = this.toJson(this.sample_query)['query_type'];
    } catch (e) {
      console.log('query processing error ->> ', e);
      setTimeout(function() {
        __this.presentToast('JSON Format ERROR in query', 1000);
      }, 1000);
    }

    try {
      sample_query = this.toString(sample_query);
      sample_query = sample_query.replaceAll('"', '');

      _.forEach(sample_request, function(obj: { value: any; key: string }) {
        if (typeof obj.value === 'boolean') {
          sample_query = __this.replaceSpec(
            sample_query,
            __this.getReplaseKey(obj.key),
            obj.value,
            'boolean'
          );
        } else if (Array.isArray(obj.value)) {
          sample_query = __this.replaceSpec(
            sample_query,
            __this.getReplaseKey(obj.key),
            obj.value,
            'object'
          );
        } else {
          // console.log(
          //   'Key: ',
          //   __this.getReplaseKey(obj.key),
          //   'Value: ',
          //   obj.value
          // );
          sample_query = sample_query.replaceAll(
            __this.getReplaseKey(obj.key),
            obj.value
          );
        }
      });

      let getCollection =
        'db.getCollection("' + collection + '").' + query_type + '(OUTPUT)';
      console.log('OPERATION ->> ', getCollection);
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
        console.log('boolean', key, value);
        return query.replaceAll(key, value);
        break;
      case 'object':
        console.log('object', key, value);
        let stringArr = '[' + value.toString() + ']';
        return query.replaceAll(key, stringArr);
        break;
      default:
        console.log('default');
    }
  }

  getReplaseKey(key) {
    let newKey = key.replaceAll('@', '');
    return '<<-' + newKey.toString() + '->>';
  }
}
