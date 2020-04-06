import React from "react";
import { Link } from "react-router-dom";

const RecipeItem = ({ category, recipe }) => {
  //
  if (recipe) {
    const { url, label, image, source } = recipe;
    let queryStr = "";

    if (category) queryStr = `/recipes/${category}/${label}/${source}`;
    else queryStr = `/recipes/${label}/${source}`;

    //const srchItem = "c=" + category + "l=" + label + "s=" + source;
    return (
      <div className=" col-md-4 col-sm-4 col-xs-4 recipeItem">
        <div className="card mb-3 box-shadow">
          <Link to={queryStr}>
            <img src={image} alt="img" className="card-img-top" />
          </Link>
          <div className="card-body" style={{ textAlign: "center" }}>
            <h6 className="card-title">{label}</h6>
            <span style={{ color: "gray" }}>by {source}</span>
          </div>
        </div>
      </div>
    );
  }
  return <div></div>;
};

export default RecipeItem;
