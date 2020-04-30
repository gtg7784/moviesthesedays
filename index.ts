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

let imgIndex = 0;

// 네이버 박스 오피스 순위 url
const url: string = "https://search.naver.com/search.naver?where=nexearch&sm=tab_etc&query=%EB%B0%95%EC%8A%A4%EC%98%A4%ED%94%BC%EC%8A%A4%20%ED%9D%A5%ED%96%89%EC%88%9C%EC%9C%84";

// text와 img src 가져올 쿼리셀렉터
const dataSelector: string = "#main_pack > div.content_search.section._cs_movie_box_office > div > div.contents03_sub > div > div.movie_rank_wrap > div.movie_audience_ranking._main_panel.v2";

const getData = async () => {
  // puppeteer 실행 및 페이지 이동
  const crawler = await puppeteer.launch();
  const page = await crawler.newPage();
  await page.goto(url);

  // text data
  const stringData = await page.$(dataSelector);

  const evalData = await page.evaluate(element => element.textContent, stringData);

  const arr = evalData.split('  ');

  const movieData = [];
  const intermediateData = []; 
  const data = [];

  arr.map(item => {
    if(item !== '') {
      movieData.push(item);
    }
  })

  // image data

  const imageData = [];

  // [0+6n] -> 관람가
  // [1+6n] -> 이름
  // [2+6n] -> 개봉*
  // [3+6n] -> 개봉 날짜
  // [4+6n] -> 일간 n명 누적 n명
  // [5+6n] -> 버튼 내용*
  // * 불변값

  for(let i: number = 0; i < movieData.length; i += 6){
    intermediateData.push({
      age: movieData[0+i],
      name: movieData[1+i],
      date: movieData[3+i],
      watch: movieData[4+i],
      isShow: movieData[5+i].indexOf("예매") === -1 ? false : true,
    })
  }

  await intermediateData.map(async (item, index) => {
    const firstNtd = Math.floor(index/8)+1;
    const secondNtd = index%8+1;

    const imgSelector: string = `#main_pack > div.content_search.section._cs_movie_box_office > div > div.contents03_sub > div > div.movie_rank_wrap > div.movie_audience_ranking._main_panel.v2 > div:nth-child(${firstNtd}) > ul > li:nth-child(${secondNtd}) > div.thumb > a`;

    const imgData = await page.$(imgSelector);

    const innerHTML = await page.evaluate(element => element.innerHTML, imgData);

    const src = innerHTML.substring(innerHTML.indexOf('src="')+5, innerHTML.indexOf('.jpg')+4);

    imageData.push(src);

    // generate data

    if(imageData.length === intermediateData.length){
      imageData.map((item, index) => {
        data.push({
          age: intermediateData[index].age,
          name: intermediateData[index].name,
          date: intermediateData[index].date,
          watch: intermediateData[index].watch,
          isShow: intermediateData[index].isShow,
          img: item
        })
      })

      sendMail(data);
    }
  })
}

const sendMail = (data) => {
  console.log(data);

}

getData();