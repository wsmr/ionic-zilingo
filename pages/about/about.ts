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

    let sample_query1: object;
    let sample_request1: object;
    console.log('changed');

    try {
      // console.log(
      //   'requests/req_args -> ' +
      //     this.toString(
      //       this.toJson(this.sample_request)['requests'][0]['req_args']
      //     )
      // );
      sample_request1 = [
        { value: 'ds6_analytics', key: '@data_source' },
        { name: 'st_date', key: '@st_date', value: '2020-11-27' },
        {
          name: 'modules',
          key: '@modules',
          value: [
            'Line 07',
            'Line 08',
            'Line 09',
            'Line 10',
            'Line 11',
            'Line 12',
            'Line 13',
            'Line 14',
            'Line 15',
            'Line 16'
          ]
        },
        { name: 'start_date', key: '@start_date', value: '2021-08-10' },
        { name: 'end_date', key: '@end_date', value: '2021-08-10' },
        {
          name: 'window',
          key: '@window',
          value: '2020-11-27T00:00:00.000Z/2021-08-10T23:59:59.000Z'
        },
        {
          name: 'window_today',
          key: '@window_today',
          value: '2021-08-10T00:00:00.000Z/2021-08-11T00:00:00.000Z'
        },
        { name: 'filter_dim1', key: '@filter_dim1', value: '@filter_dim1' },
        { name: 'filter_dim2', key: '@filter_dim2', value: '@filter_dim2' },
        { name: 'filter_dim3', key: '@filter_dim3', value: '@filter_dim3' },
        {
          name: 'filter_values1',
          key: '@filter_values1',
          value: '@filter_values1'
        },
        {
          name: 'filter_values2',
          key: '@filter_values2',
          value: '@filter_values2'
        },
        {
          name: 'filter_values3',
          key: '@filter_values3',
          value: '@filter_values3'
        },
        { name: 'filter_type1', key: '@filter_type1', value: 'true' },
        { name: 'filter_type2', key: '@filter_type2', value: 'true' },
        { name: 'filter_type2', key: '@filter_type3', value: 'true' },
        { name: 'subject_key', key: '@subject_key', value: 'idn-pan-mas' }
      ];
    } catch (e) {
      console.log('request processing error ->> ', e);
      this.presentToast('JSON Format ERROR in request', 1000);
    }

    try {
      // console.log(
      //   'query -> ' + this.toString(this.toJson(this.sample_query)['query'])
      // );
      sample_query1 = [
        "{'$match':{'subject_key': '<<-subject_key->>', 'details.line': { '$in': '<<-modules->>'}}}",
        "{'$addFields': {'error_out': {'$and': [{'$gt': ['$actual_qty', 0]}, {'$eq': ['$wip_i', 0]}, {'$lte': ['$wip_o', 0]}]}, 'error_in': {'$and': [{'$eq': ['$actual_qty', 0]}, {'$eq': ['$wip_i', 0]}, {'$gt': ['$wip_o', 0]}]}}}",
        "{'$match': {'error_out': false, 'error_in': false}}",
        "{'$project':{ 'added_date':{ '$dateToString': { 'format': '%Y-%m-%d', 'date': {'$add': [new Date(0), {'$add':['$added_time',21600000]}]}}}, 'data':{'module':'$details.line', 'buyer':'$details.buyer', 'po': '$details.po', 'order_ref': '$details.order_ref', 'product_category': '$details.product_category', 'style': '$details.style', 'color': '$details.color', 'size': '$details.size'}, 'wip':{'wip_i':{'$cond': [ { '$eq': ['$store_name', 'cutbank_in_store'] }, '$wip_i', 0 ]}, 'wip_o':{'$cond': [ { '$eq': ['$store_name', 'cutbank_out_store'] }, '$wip_i', 0 ]}}}}",
        "{'$addFields':{'bid': { '$concat': ['$data.module','@','$data.buyer','@','$data.po','@','$data.order_ref','@','$data.style','@','$data.color','@','$data.size']}}}",
        "{'$match':{'added_date': {'$gte': '<<-st_date->>','$lte': '<<-start_date->>'}}}",
        "{'$group':{'_id':'$data','cum_wip_i': {'$sum': '$wip.wip_i'}, 'cum_wip_o': {'$sum': '$wip.wip_o'}}}",
        "{'$group':{'_id':'$_id.module', 'data': { '$push': {'module': '$_id.module', 'buyer': '$_id.buyer', 'po': '$_id.po', 'order_ref': '$_id.order_ref', 'style': '$_id.style', 'color': '$_id.color', 'size': '$_id.size', 'cum_wip_i': '$cum_wip_i', 'cum_wip_o': '$cum_wip_o', 'cum_wip':{'$subtract': [ '$cum_wip_i', '$cum_wip_o']}}}, 'cum_wip_i': {'$sum': '$cum_wip_i'}, 'cum_wip_o': {'$sum': '$cum_wip_o'}}}",
        "{'$addFields':{'cum_wip': { '$subtract': ['$cum_wip_i', '$cum_wip_o']}}}",
        "{'$project': {'data': {'$filter': {'input': '$data', 'as': 'item',  'cond': {'$gte': ['$$item.cum_wip', 0]}}}}}"
      ];
    } catch (e) {
      console.log('query processing error ->> ', e);
      setTimeout(function() {
        __this.presentToast('JSON Format ERROR in query', 1000);
      }, 1000);
    }

    try {
      sample_query = this.toString(sample_query1);
      sample_query = sample_query.replaceAll('"', '');

      _.forEach(sample_request1, function(obj: { value: any; key: string }) {
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
