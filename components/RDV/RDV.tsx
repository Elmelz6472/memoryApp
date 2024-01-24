import React from "react";
import { useForm } from "react-hook-form";


interface IFormInput {
    name: string;
    address: string;
    city: string;
    state: string;
    phone: string;
    zipcode: string;
}

const Form: React.FC = () => {
    const {
        register,
        handleSubmit,
    } = useForm<IFormInput>();

    const onSubmit = (data: IFormInput) => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label>Name</label>
            <input {...register("name")} />

            <label>Address</label>
            <input {...register("address")} />

            <div className="input-group">
                <div className="input-field">
                    <label>City</label>
                    <input {...register("city")} />
                </div>
                <div className="input-field">
                    <label>State</label>
                    <input {...register("state")} />
                </div>
                <div className="input-field">
                    <label>ZIP Code</label>
                    <input {...register("zipcode")} />
                </div>
            </div>
            <label>Phone</label>
            <input {...register("phone")} />

            <input type="submit" />
        </form>
    );
};

export default Form;