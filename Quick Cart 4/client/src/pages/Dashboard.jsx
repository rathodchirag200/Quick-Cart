import React from "react";
import { Hero } from "../Componenets/Hero";
import { Products } from "../Componenets/Products";
import { Bestseller } from "../Componenets/Bestseller";
import { Subscribe } from "../Componenets/subscribe";
import { Popular } from "../Componenets/popular";

export const Dashboard = () => {
  return (
    <div>
      <Hero />
      <Products/>
      <Bestseller/>
      <Popular/>
      <Subscribe/>
    </div>
  );
};
