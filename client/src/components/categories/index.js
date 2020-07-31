import React, { useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import classnames from "classnames";

const CategoryList = ({ type }) => {
  //   const showCategory = (ctgry) => {
  //     onClearFliters();
  //     //console.log("in showCategory() srchTerm1:", srchTerm);
  //     setCategory(ctgry);
  //     setHeader(ctgry);
  //     getRecipes(ctgry);
  //     setShowCategories(false);
  //     setShowRecipes(true);
  //     setErrors();
  //   };

  const showLink = (img, ctgry) => {
    return (
      <React.Fragment>
        <img src={img} alt="img" className="card-img-top" />
        <div className="categoryCaption">
          {/* <h3 onClick={() => showCategory(ctgry)}>{ctgry}</h3> */}
          <h3> {ctgry}</h3>{" "}
        </div>
      </React.Fragment>
    );
  };
  const categoryLink = (img, ctgry) => (
    // {"form-group", { "has-error": errors })}>
    <div
      className={classnames("col-lg-1 col-md-2 col-sm-2 col-xs-2 selCategory", {
        "col-lg-1 col-md-2 col-sm-2 col-xs-2 selCategory": type === "home",
      })}
    >
      {type === "home" ? (
        <div className="card mb-3 box-shadow ctgry-card">
          <Link to={`/filter/${ctgry}`} className="categoryLink">
            {showLink(img, ctgry)}{" "}
          </Link>
        </div>
      ) : (
        <div className="card mb-3 box-shadow">
          <Link to={`/recipes/${ctgry}`} className="categoryLink">
            {showLink(img, ctgry)}{" "}
          </Link>
        </div>
      )}
    </div>
  );

  useEffect(() => {
    console.log(type);
  });
  return (
    <div className="category-mnu-wrapper">
      <div className="row">
        {categoryLink(
          "https://www.edamam.com/web-img/98a/98aa5d5cc0d88b28c2b9221a099b1a14.jpg",
          "Beef"
        )}
        {categoryLink(
          "https://www.edamam.com/web-img/cdf/cdf5903cc1799537ef1f7644880e39f8.jpg",
          "Chicken"
        )}
        {categoryLink(
          "https://www.edamam.com/web-img/5a5/5a5220b7a65c911a1480502ed0532b5c.jpg",
          "Pasta"
        )}
        {categoryLink(
          "https://www.edamam.com/web-img/3b2/3b27306076f4940419e3e0127725a57b.jpg",
          "Soups"
        )}
        {categoryLink(
          "https://www.edamam.com/web-img/272/2724347f1843a7c437faacf837326676.jpg",
          "Salad"
        )}
        {categoryLink(
          "https://www.edamam.com/web-img/605/605db9567967e4fcef1eb059d0cfd7fe.jpg",
          "Seafood"
        )}
        {categoryLink(
          "https://www.edamam.com/web-img/ab6/ab6e92ca81b5cde8127582cda4c00864.jpg",
          "Vegeterian"
        )}
        {categoryLink(
          "https://www.edamam.com/web-img/84c/84c49b028be56aafa29ef7505d4dfb60.jpg",
          "Desserts"
        )}
        {categoryLink(
          "https://www.edamam.com/web-img/88f/88f1a1c61f6d257e58aae3733440a58b",
          "Drinks"
        )}
        {categoryLink(
          "https://www.edamam.com/web-img/b80/b80c4325b0ab90776020df68634b9c0b.jpg",
          "Condiments"
        )}
        {categoryLink(
          "https://www.edamam.com/web-img/cd2/cd22b14330062e18fbdf3f41017d4bb9",
          "Breakfast"
        )}
        {categoryLink(
          "https://www.edamam.com/web-img/675/675460d88ec4b6324369fe95763539d6.jpg",
          "Sides"
        )}
      </div>
    </div>
  );
};
export default CategoryList;
