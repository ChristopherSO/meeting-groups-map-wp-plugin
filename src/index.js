import Plugin from './Plugin/Plugin';
import './index.scss';

const { render } = wp.element; // We use wp.element here instead of importing react

if (document.getElementById('react-plugin')) { //check if element exists before rendering
  render(<Plugin />, document.getElementById('react-plugin'));
}
