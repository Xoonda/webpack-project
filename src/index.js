import * as $ from 'jquery';
import Post from '@models/post';
import './styles/styles.css';
import webpackLogo from './assest/webpack-logo.png';
import './styles/less.less';
import './styles/scss.scss';

const post = new Post('Webpack Post Title', webpackLogo);
$('pre').addClass('code').html(post.toString());
console.log('Post to string', post.toString());

