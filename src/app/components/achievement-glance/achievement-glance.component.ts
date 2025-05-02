import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { NgForOf } from '@angular/common';
import SwiperCore, { Navigation, Pagination, Autoplay } from 'swiper';

import Swiper from 'swiper';
import 'swiper/swiper-bundle.min.css';

// Initialize Swiper modules
SwiperCore.use([Navigation, Pagination, Autoplay]);

@Component({
  selector: 'app-achievement-glance',
  standalone: true,
  imports: [NgForOf], // Only standalone components or directives here
  templateUrl: './achievement-glance.component.html',
  styleUrls: ['./achievement-glance.component.scss']
})
export class AchievementGlanceComponent implements AfterViewInit {
  @ViewChild('swiper-container') swiperContainer: ElementRef | undefined;

  achievements = [
    { image: 'emrs (1).jpg', caption: 'Students won regional science fair' },
    { image: 'emrs (2).jpg', caption: 'Annual sports champions 2024' },
    { image: 'emrs (3).jpg', caption: 'Smart classroom inauguration' },
    { image: 'emrs (4).jpg', caption: 'Clean school award 2023' },
    { image: 'emrs (5).jpg', caption: 'Art competition winners' }
  ];
  govLinks = [
    {
      title: 'National Portal of India',
      url: 'https://india.gov.in/',
      image: 'npi.jpeg'
    },
    {
      title: 'Ministry of Tribal Affairs',
      url: 'https://tribal.nic.in/',
      image: 'mta.jpeg'
    },
    {
      title: 'TDD, Odisha',      url: 'https://stsc.odisha.gov.in/',
      image: 'tdd.jpeg'
    },
    {
      title: 'NCST',
      url: 'https://ncst.nic.in/',
      image: 'ncst.jpg'
    },
    {
      title: 'Odisha Government',
      url: 'https://odisha.gov.in/',
      image: 'odisha.jpeg'
    }
  ];



  ngAfterViewInit() {
    const swiper = new Swiper('.swiper-container', {
      slidesPerView: 1,
      spaceBetween: 10,
      loop: true,
      autoplay: {
        stopOnLastSlide: false,
        disableOnInteraction: false,
        delay: 3000,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      }
    });
  }
}
