import axios from 'axios'
import { OrderDetails, OrderDetailsExtended, OrderHeader, OrderHeaderExtended } from '../../Interfaces/OrderInterfaces';

const getordernoImageurl = `${process.env.REACT_APP_API_URL}/OrderDetail/GetNotImage`

const getorderlisturl = `${process.env.REACT_APP_API_URL}/OrderDetail/`

const orderheaderurl = `${process.env.REACT_APP_API_URL}/Orders/`

const orderheaderextendrurl = `${process.env.REACT_APP_API_URL}/Orders/HaveAccount/`

const getorderdetailpaymenturl =`${process.env.REACT_APP_API_URL}/OrderDetail/PurchaseConfirmationImage/`

const getextendedorderdetail = `${process.env.REACT_APP_API_URL}/OrderDetail/All`

const getorderbysellerurl =`${process.env.REACT_APP_API_URL}/OrderDetail/BySeller/`

const getorderbybuyerurl =`${process.env.REACT_APP_API_URL}/OrderDetail/ByBuyer/`

export async function GetOrderDetailBySeller(id:string) {
    
    try{
        let form:OrderDetailsExtended[] = await axios.get(getorderbysellerurl+id).then(response => response.data)
        return form
    }catch(err){
      console.log(err)
    }
  }

  export async function GetOrderDetailByBuyer(id:string) {
    
    try{
        let form:OrderDetailsExtended[] = await axios.get(getorderbybuyerurl+id).then(response => response.data)
        return form
    }catch(err){
      console.log(err)
    }
  }

export async function GetOrderHeader() {
    try{
        let form:OrderHeader[] = await axios.get(orderheaderurl).then(response => response.data)
        return form
        
    }catch(err){
      console.log(err)
    }
  }

export async function GetOrderHeaderByID(id:string) {
    try{
        let form:OrderHeaderExtended = await axios.get(orderheaderextendrurl+id).then(response => response.data)
        return form
        
    }catch(err){
      console.log(err)
    }
  }

export async function GetOrderDetailListNoImageExtended() {
    
    try{
        let form:OrderDetailsExtended[] = await axios.get(getextendedorderdetail).then(response => response.data)
        return form
    }catch(err){
      console.log(err)
    }
  }

export async function GetOrderDetailListNoImage() {
    
    try{
        let form:OrderDetails[] = await axios.get(getordernoImageurl).then(response => response.data)
        return form
    }catch(err){
      console.log(err)
    }
  }

  export async function GetOrderDetaiPaymentlID(id:string) {
    try{
        let form:string = await axios.get(getorderdetailpaymenturl+id).then(response => response.data)
        return form
        
    }catch(err){
      console.log(err)
    }
  }

export async function GetOrderDetailList() {
    
    try{
        let form:OrderDetails[] = await axios.get(getorderlisturl).then(response => response.data)
        return form
    }catch(err){
      console.log(err)
    }
  }

  export async function GetOrderDetailID(id:string) {
    try{
        let form:OrderDetails = await axios.get(getorderlisturl+id).then(response => response.data)
        return form
        
    }catch(err){
      console.log(err)
    }
  }