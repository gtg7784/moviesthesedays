import * as puppeteer from 'puppeteer';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';

require('dotenv').config();

// 네이버 박스 오피스 순위 url
const url = "https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&query=%EB%B0%95%EC%8A%A4%EC%98%A4%ED%94%BC%EC%8A%A4";

const getData = async () => {
  const crawler = await puppeteer.launch();
  const page = await crawler.newPage();
  await page.goto(url);
  const data = await page.$('#main_pack > div.content_search.section._cs_movie_box_office > div > div.contents03_sub > div > div.movie_rank_wrap > div.movie_audience_ranking._main_panel.v2');

  const evalData = await page.evaluate(element => element.textContent, data);

  const arr = evalData.split('  ');

  const movieData = [];

  console.log(arr);

  arr.map(item => {
    if(item !== '') {
      movieData.push(item);
    }
  })

  console.log(movieData);

  fs.writeFile('./arr.txt', movieData, err => {
    if (err) {
      console.error(err)
      return
    }
  })
}

getData();