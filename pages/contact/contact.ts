import { Component } from '@angular/core';
import { NavController, ToastController } from 'ionic-angular';
var _ = require('lodash');

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  public sample_request = {
    requests: [
      {
        req_id: 'packed_analysis_request',
        req_args: [{ key: '@filter_value6', value: [] }]
      }
    ]
  };
  public sample_query = {
    query: {
      dimensions: [
        {
          type: 'extraction',
          dimension: 'subject',
          outputName: 'subject',
          extractionFn: {
            type: 'javascript',
            function:
              "function(x) {if(x==null) return 'N/A';var a = x.split('-');var b = a.splice(a.length-@subject_splitter,@subject_splitter);var c = a.join('-'); return c;}"
          }
        },
        '@time_block1'
      ],
      granularity: '@granularity',
      filter: {
        type: 'and',
        fields: [
          {
            type: '@filter_type7',
            dimension: '@filter_dim7',
            values: '@filter_value7'
          }
        ]
      }
    }
  };
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
    let sample_request: object;
    console.log('changed');

    try {
      console.log(
        'requests/req_args -> ' +
          this.toString(this.sample_request['requests'][0]['req_args'])
      );
      sample_request = this.sample_request['requests'][0]['req_args'];
    } catch (e) {
      console.log('request processing error ->> ', e);
      this.presentToast('JSON Format ERROR in request', 1000);
    }

    try {
      console.log('query -> ' + this.toString(this.sample_query['query']));
      sample_query = this.toString(this.sample_query['query']);
      // if(_.has(sample_query, '_id')) {
      //   delete sample_query['_id'];
      // }
    } catch (e) {
      console.log('query processing error ->> ', e);
      this.presentToast('JSON Format ERROR in query', 2000);
    }

    try {
      _.forEach(sample_request, function(obj) {
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
      this.presentToast('ERROR in data processing', 3000);
    }
  }

  replaceSpec(query: string, key: string, value: any, type: string) {
    let queryJS = this.toJson(query);
    console.log('queryJS', queryJS);
    _.forEach(queryJS, function(obj) {
      console.log('obj', obj);
    });
    switch (type) {
      case 'boolean':
        console.log('boolean', key, value);
        return _.replace(query, key, value);
        break;
      case 'object':
        console.log('object', key, value);
        let stringArr = '[' + value.toString() + ']';
        return _.replace(query, key, stringArr);
        break;
      default:
        console.log('default');
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
