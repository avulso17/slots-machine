import { Boot, Preloader } from "../core";
import { Game } from "./Game";
import { Gpt } from "./Gpt";
import { Grok } from "./Grok";
import { MainMenu } from "./MainMenu";

export const scenes = [Boot, Preloader, MainMenu, Game, Gpt, Grok];
