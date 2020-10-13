import { Context, Callback } from 'aws-lambda'
import { LambdaHandler } from '../lib/classes/lambdahandler/LambdaHandler.class'
import { IPushSendRequest, IPushSendResponse } from '../lib/interfaces/push-server-service-interface/send.interface'
import * as FCM from 'fcm-node'


export function handler(incomingRequest:IPushSendRequest, context:Context, callback:Callback) {

  class HandlerObject extends LambdaHandler {

    protected request:IPushSendRequest
    protected response:IPushSendResponse
    private fcm:FCM
    private pushObject:any


    constructor(incomingRequest:IPushSendRequest, context:Context, callback:Callback) {
      super(incomingRequest, context, callback)
    }












    protected allConditionsAreMet():Promise<boolean> {
      return new Promise((resolve, reject)=> {
        if (FCM) resolve(true)
        else reject(false)
      })
    }












    protected performActions() {
      if (!this.request.to) this.hasSucceeded('Keeping warm...')
      else this.proceed()
    }




        private proceed() {
          this.createPushNotification()
          this.assignRecipients()
          this.assignData()
          this.assignCollapseTitle()
          this.sendPushNotification()
        }




            private createPushNotification() {
              this.pushObject = {
                notification: {
                  title: this.request.title,
                  body: this.request.body
                }
              }
            }




            private assignRecipients() {
              if (this.request.to.constructor === Array) this.pushObject.registration_ids = this.request.to
              else this.pushObject.to = this.request.to
            }




            private assignData() {
              if (this.request.data) this.pushObject.data = this.request.data
            }




            private assignCollapseTitle() {
              if (this.request.collapseTitle) this.pushObject.collapse_key = this.request.collapseTitle
            }




            private sendPushNotification() {
              this.fcm = new FCM(process.env.fcmServerKey)
              this.fcm.send(this.pushObject, (failure, success)=> {
                if (success) this.hasSucceeded(success)
                else this.hasFailed(failure)
              })
            }


  } // End Handler Class ---------

  new HandlerObject(incomingRequest, context, callback)

} // End Main Handler Function -------
