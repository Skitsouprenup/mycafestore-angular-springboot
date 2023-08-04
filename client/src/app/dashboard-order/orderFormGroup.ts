import { FormBuilder, Validators } from "@angular/forms"
import { GlobalConstants } from "src/scripts/global_constants"

const orderFormGroup = (formBuilder: FormBuilder) => {
    const defaultFormControlState = { value: "", disabled: false }

    return formBuilder.group({
      customerName: [
        defaultFormControlState, 
        [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]
      ],
      email: [
        defaultFormControlState, 
        [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]
      ],
      contactNumber: [
        defaultFormControlState, 
        [Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]
      ],
      paymentMethod: [
        defaultFormControlState, 
        [Validators.required]
      ],
      productCategory: [
        defaultFormControlState, 
        [Validators.required]
      ],
      productName: [
        { value: "", disabled: true }, 
        [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]
      ],
      price: [
        { value: "", disabled: true }, 
        [Validators.required]
      ],
      quantity: [
        defaultFormControlState, 
        [Validators.required]
      ],
      total: [
        { value: "", disabled: true }, 
        [Validators.required]
      ],
    })
}

export default orderFormGroup