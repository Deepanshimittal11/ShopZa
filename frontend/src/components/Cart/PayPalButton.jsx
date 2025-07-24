import { PayPalButtons , PayPalScriptProvider} from '@paypal/react-paypal-js';

const PayPalButton = ({amount, onSuccess, onError }) => {
  return (
    <PayPalScriptProvider options={{"client-id": 
        "ARW8S4E7cWIrV-WHpnYxBXgRvBDqoOEi-jo2CW_n7BprVLB8EHfJ7nDz9z4JqhWvTp0KTYzJ9L66c3nD"}}
    >
      <PayPalButtons
        style={{layout: "vertical"}}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [{amount: {value: amount}}]
          })
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then(onSuccess)
        }}
        onError={onError}
      ></PayPalButtons>
    </PayPalScriptProvider>
  )
}

export default PayPalButton