import React from "react";
import { Route, Switch } from "react-router-dom";
//Pages
import SigninPage from "./components/user/signin";
import SignupPage from "./components/user/signup";
import UserPage from "./components/user";
import FavoritesPage from "./components/user/favorites";
import RecipesPage from "./components/recipes";
import CategoryRecipesPage from "./components/recipes/filter";
import RecipeDetailPage from "./components/recipes/detail";
const Routes = () => {
  return (
    <Switch>
      <Route path="/recipes/:c/:l/:s" component={RecipeDetailPage} />
      <Route path="/recipes/:l/:s" component={RecipeDetailPage} />
      <Route path="/filter/:c" component={CategoryRecipesPage} />
      <Route path="/recipes/:c" component={RecipesPage} />
      <Route path="/user/signin" component={SigninPage} />
      <Route path="/user/signup" component={SignupPage} />
      <Route path="/user/favorites" component={FavoritesPage} />
      <Route path="/user/" component={UserPage} />
      <Route path="/:category" component={RecipesPage} />
      <Route path="/" exact component={RecipesPage} />
    </Switch>
  );
};
export default Routes;
