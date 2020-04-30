import * as puppeteer from 'puppeteer';
import * as nodemailer from 'nodemailer';

require('dotenv').config();

interface dataType {
  img?: string;
  data?: string;
  age?: string;
  name?: string;
  date?: string;
  watch?: string;
}

// 네이버 박스 오피스 순위 url
const url: string = "https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&query=%EB%B0%95%EC%8A%A4%EC%98%A4%ED%94%BC%EC%8A%A4%20%ED%9D%A5%ED%96%89%EC%88%9C%EC%9C%84";
const dataSelector: string = "#main_pack > div.content_search.section._cs_movie_box_office > div > div.contents03_sub > div > div.movie_rank_wrap > div.movie_audience_ranking._main_panel.v2";
const selector: string = "._content";

const getData = async () => {
  const crawler = await puppeteer.launch();
  const page = await crawler.newPage();
  await page.goto(url);
  const stringData = await page.$(dataSelector);

  const evalData = await page.evaluate(element => element.textContent, stringData);

  const arr = evalData.split('  ');

  const movieData = [];
  const data = [];

  arr.map(item => {
    if(item !== '') {
      movieData.push(item);
    }
  })

  // [0] -> 관람가
  // [1] -> 이름
  // [2] -> 개봉*
  // [3] -> 개봉 날짜
  // [4] -> 일간 n명 누적 n명
  // [5] -> 버튼*
  // * 불변값

  for(let i: number = 0; i < movieData.length; i += 6){
    data.push({
      age: movieData[0+i],
      name: movieData[1+i],
      date: movieData[3+i],
      watch: movieData[4+i],
    })
  }

  console.log(data);
}

getData();