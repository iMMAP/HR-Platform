/** import React, PropTypes and classname */
import React from 'react';
import PropTypes from 'prop-types';
import classname from 'classnames';

/** import configuration value and validation helper */
/** Unhide the code below if the pdf viewer is slow */
// import { Document, Page } from 'react-pdf/dist/entry.webpack';

/** Hide the code below if the pdf viewer is slow.
 * This configuration will not cause an issue while running documentation script
 */
import { Document, Page } from 'react-pdf';

/** import Material UI withStyles and icons */
import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';

/** import React Redux and it's actions */
import { connect } from 'react-redux';
import { onPDFLoaded } from '../../redux/actions/common/PDFViewerActions';

/** import Fontawesome Icon */
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileDownload } from '@fortawesome/free-solid-svg-icons/faFileDownload';

/** import configuration value */
import { white, secondaryColor } from '../../config/colors';
import isEmpty from '../../validations/common/isEmpty';

/**
 * downloadPdf is a function to download a pdf
 * @param {string} blobFile - blob string file
 * @param {string} fileURL - fileURL
 */
const downloadPdf = (blobFile, fileURL) => {
  let elementA = window.document.createElement("a");
  elementA.href = blobFile;
  elementA.download = fileURL.split('/').pop();
  document.body.appendChild(elementA);
  elementA.click();
  document.body.removeChild(elementA);
}

/**
 * PDFViewer is a function component to show PDF File
 *
 * @name PDFViewer
 * @component
 * @category Common
 * @subcategory PDFViewer
 * @param {object}    props - prop value
 * @param {string}    props.fileURL - file url
 * @param {string}    props.blobFile - file blob url
 * @param {function}  props.onPDFLoaded - function to load pdf file
 * @param {boolean}   props.pdfViewerOpen - value to open / close pdf viewer
 * @param {number}    props.total_page_number - page total
 * @param {string}    props.bg - choose light or normal containier
 * @param {object}    props.classes - material ui styles
 * @param {boolean}   props.canDownload - value to show/hide download pdf button
 * @returns {ReactNode}
 */
const PDFViewer = ({ fileURL, blobFile, onPDFLoaded, pdfViewerOpen, total_page_number, bg, classes, canDownload = true, canClosePdfViewer = true }) => {
	return (
		<div
			className={
				pdfViewerOpen ? bg == 'light' ? (
					classes.lightContainer
				) : (
					classes.container
				) : (
					classname(classes.container, classes.hideViewer)
				)
			}
		>
      {canClosePdfViewer ? (
        <div className={classes.closeElement} onClick={() => onPDFLoaded('pdfViewerOpen', false)} />
      ) : (
        <div className={classes.closeElement} />
      )}
			<div className={classes.navigation}>
				{canDownload && <a href="#" onClick={() => downloadPdf(blobFile, fileURL)}>
					<IconButton className={classes.navBtn}>
						<FontAwesomeIcon icon={faFileDownload} size="sm" className={classes.fontawesome} />
					</IconButton>
				</a>}
			</div>
			{pdfViewerOpen && !isEmpty(blobFile) && (
				<Document
					file={blobFile}
					onLoadSuccess={(document) => onPDFLoaded('total_page_number', document.numPages)}
					className={classes.pdf}
				>
					{Array.from(new Array(total_page_number), (el, index) => (
						<Page
							key={`page_${index + 1}`}
							pageNumber={index + 1}
							scale={1.5}
							renderMode="canvas"
							className={classes.pdfPage}
              renderTextLayer={false}
						/>
					))}
				</Document>
			)}
		</div>
	);
};

PDFViewer.defaultProps = {
	bg: 'normal',
  canDownload: true
};

PDFViewer.propTypes = {
  /**
   * classes is a prop containing styles for this component generated by material-ui v3
   */
  classes: PropTypes.object.isRequired,
  /**
   * fileURL is a prop containing file url
   */
	fileURL: PropTypes.string.isRequired,
  /**
   * blobFile is a prop containing converted blobFile to base64 string
   */
  blobFile: PropTypes.string,
  /**
   * onPDFLoaded is a function prop to change data in pdfViewer redux store
   */
	onPDFLoaded: PropTypes.func.isRequired,
  /**
   * pdfViewerOpen is a prop to show or hide this component
   */
  pdfViewerOpen: PropTypes.bool.isRequired,
  /**
   * total_page_number is a prop to show total page number
   */
	total_page_number: PropTypes.number.isRequired,
  /**
   * bg is a prop to determine the background color of this component
   */
  bg: PropTypes.oneOf(['light', 'normal']),
  /**
   * canDownload is a prop value to enable/disable download capability
   */
  canDownload: PropTypes.bool,
  /**
   * canClosePdfViewer is a prop value to show / close the pdf viewer
   */
  canClosePdfViewer: PropTypes.bool
};

/**
 * set up map dispatch to props for this component
 * @ignore
 * @property {object} mapDispatchToProps - contain redux actions to be used in component via props
 */
const mapDispatchToProps = {
	onPDFLoaded
};

/**
 * set up map state to props for this component
 * @ignore
 * @param {object} state
 * @returns {object} all needed state data inside reducer that are mapped as a prop to be used in the component
 */
const mapStateToProps = (state) => ({
	total_page_number: state.pdfViewer.total_page_number,
	fileURL: state.pdfViewer.fileURL,
	blobFile: state.pdfViewer.blobFile,
	pdfViewerOpen: state.pdfViewer.pdfViewerOpen,
	canDownload: state.pdfViewer.canDownload,
  canClosePdfViewer: state.pdfViewer.canClosePdfViewer,
});

/**
 * set up styles for this component
 * @ignore
 * @returns {object} classes prop to apply styles in the component
 */
const styles = () => ({
	hideViewer: {
		display: 'none !important'
	},
	container: {
		position: 'fixed',
		width: '100%',
		height: '100%',
		'z-index': 999999999,
		background: 'rgba(0,0,0,0.6)',
		top: 0,
		left: 0,
		overflow: 'scroll'
	},
	lightContainer: {
		position: 'fixed',
		width: '100%',
		height: '100%',
		'z-index': 999999999,
		background: 'rgba(0,0,0,0.2)',
		top: 0,
		left: 0,
		overflow: 'scroll'
	},
	pdf: {
		'margin-top': '64px',
		'margin-bottom': '32px',
		left: '50%',
		position: 'absolute',
		transform: 'translate(-50% ,0)',
		'z-index': 9999999998
	},
	pdfPage: {
		'margin-bottom': '8px',
		'&:last-child': {
			'margin-bottom': 0
		},
    pointerEvents: 'none'
	},
	navigation: {
		position: 'fixed',
		width: 'calc(100% - 32px)',
		height: '50px',
		background: '#474747',
		'box-shadow':
			'inset 0 1px 1px hsla(0,0%,0%,.15), inset 0 -1px 0 hsla(0,0%,100%,.05), 0 1px 0 hsla(0,0%,0%,.15), 0 1px 1px hsla(0,0%,0%,.1)',
		'z-index': 9999999999,
		'padding-left': '16px',
		'padding-right': '16px'
	},
	navBtn: {
		color: white,
		'&:hover': {
			background: secondaryColor
		},
		float: 'right',
		margin: '0 8px'
	},
	fontawesome: {
		width: '1em !important'
	},
	closeElement: {
		position: 'fixed',
		width: '100%',
		height: '100%',
		'z-index': 999999999,
		background: 'transparent',
		top: 0,
		left: 0,
		overflow: 'scroll'
	}
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(PDFViewer));
