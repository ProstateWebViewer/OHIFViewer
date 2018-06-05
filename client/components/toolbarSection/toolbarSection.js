import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';

import { OHIF } from 'meteor/ohif:core';
import 'meteor/ohif:viewerbase';

function isThereSeries(studies) {
    if (studies.length === 1) {
        const study = studies[0];

        if (study.seriesList && study.seriesList.length > 1) {
            return true;
        }

        if (study.displaySets && study.displaySets.length > 1) {
            return true;
        }
    }

    return false;
}

Template.toolbarSection.onCreated(() => {
    const instance = Template.instance();

    if (OHIF.uiSettings.leftSidebarOpen && isThereSeries(instance.data.studies)) {
        instance.data.state.set('leftSidebar', 'studies');
    }
});

Template.toolbarSection.helpers({
    leftSidebarToggleButtonData() {
        const instance = Template.instance();
        return {
            toggleable: true,
            key: 'leftSidebar',
            value: instance.data.state,
            options: [{
                value: 'studies',
                svgLink: '/packages/ohif_viewerbase/assets/icons.svg#icon-studies',
                svgWidth: 15,
                svgHeight: 13,
                bottomLabel: 'Series'
            }]
        };
    },

    rightSidebarToggleButtonData() {
        const instance = Template.instance();
        return {
            toggleable: true,
            key: 'rightSidebar',
            value: instance.data.state,
            options: [{
                value: 'hangingprotocols',
                iconClasses: 'fa fa-file-text-o',
                bottomLabel: 'Report'
            }]
        };
    },

    toolbarButtons() {
        const extraTools = [];

        extraTools.push({
            id: 'magnify',
            title: 'Magnify',
            classes: 'imageViewerTool toolbarSectionButton',
            iconClasses: 'fa fa-circle'
        });

        extraTools.push({
            id: 'wwwcRegion',
            title: 'ROI Window',
            classes: 'imageViewerTool',
            iconClasses: 'fa fa-square'
        });

        extraTools.push({
            id: 'ellipticalRoi',
            title: 'Ellipse',
            classes: 'imageViewerTool',
            iconClasses: 'fa fa-circle-o'
        });

        extraTools.push({
            id: 'toggleDownloadDialog',
            title: 'Download',
            classes: 'imageViewerCommand',
            iconClasses: 'fa fa-camera',
            active: () => $('#downloadDialog').is(':visible')
        });

        extraTools.push({
            id: 'invert',
            title: 'Invert',
            classes: 'imageViewerCommand',
            iconClasses: 'fa fa-adjust'
        });

        extraTools.push({
            id: 'rotateR',
            title: 'Rotate Right',
            classes: 'imageViewerCommand',
            svgLink: '/packages/ohif_viewerbase/assets/icons.svg#icon-tools-rotate-right'
        });

        extraTools.push({
            id: 'flipH',
            title: 'Flip H',
            classes: 'imageViewerCommand',
            svgLink: '/packages/ohif_viewerbase/assets/icons.svg#icon-tools-flip-horizontal'
        });

        extraTools.push({
            id: 'flipV',
            title: 'Flip V',
            classes: 'imageViewerCommand',
            svgLink: '/packages/ohif_viewerbase/assets/icons.svg#icon-tools-flip-vertical'
        });

        extraTools.push({
            id: 'clearTools',
            title: 'Clear',
            classes: 'imageViewerCommand',
            iconClasses: 'fa fa-trash'
        });

        const buttonData = [];

        buttonData.push({
            id: 'resetViewport',
            title: 'Reset',
            classes: 'imageViewerCommand',
            iconClasses: 'fa fa-undo'
        });

        buttonData.push({
            id: 'zoom',
            title: 'Zoom',
            classes: 'imageViewerTool',
            svgLink: '/packages/ohif_viewerbase/assets/icons.svg#icon-tools-zoom'
        });

        buttonData.push({
            id: 'wwwc',
            title: 'Levels',
            classes: 'imageViewerTool',
            svgLink: '/packages/ohif_viewerbase/assets/icons.svg#icon-tools-levels'
        });

        buttonData.push({
            id: 'pan',
            title: 'Pan',
            classes: 'imageViewerTool',
            svgLink: '/packages/ohif_viewerbase/assets/icons.svg#icon-tools-pan'
        });

        buttonData.push({
            id: 'crosshairs',
            title: 'Sync',
            classes: 'imageViewerTool',
            iconClasses: 'fa fa-refresh'
        });

        buttonData.push({
            id: 'probe',
            title: 'Fiducial',
            classes: 'imageViewerTool',
            iconClasses: 'fa fa-dot-circle-o'
        });

        buttonData.push({
            id: 'length',
            title: 'Length',
            classes: 'imageViewerTool toolbarSectionButton',
            svgLink: '/packages/ohif_viewerbase/assets/icons.svg#icon-tools-measure-temp'
        });

        buttonData.push({
            id: 'annotate',
            title: 'Annotate',
            classes: 'imageViewerTool',
            svgLink: '/packages/ohif_viewerbase/assets/icons.svg#icon-tools-measure-non-target'
        });

        buttonData.push({
            id: 'layout',
            title: 'Layout',
            iconClasses: 'fa fa-th-large',
            buttonTemplateName: 'layoutButton'
        });

        buttonData.push({
            id: 'toggleMore',
            title: 'More',
            classes: 'rp-x-1 rm-l-3',
            svgLink: '/packages/ohif_viewerbase/assets/icons.svg#icon-tools-more',
            subTools: extraTools
        });

        return buttonData;
    },
});

Template.toolbarSection.onRendered(function() {
    const instance = Template.instance();

    instance.$('#layout').dropdown();

    if (OHIF.uiSettings.displayEchoUltrasoundWorkflow) {
        OHIF.viewerbase.viewportUtils.toggleCineDialog();
    }

    // Set disabled/enabled tool buttons that are set in toolManager
    const states = OHIF.viewerbase.toolManager.getToolDefaultStates();
    const disabledToolButtons = states.disabledToolButtons;
    const allToolbarButtons = $('#toolbar').find('button');
    if (disabledToolButtons && disabledToolButtons.length > 0) {
        for (let i = 0; i < allToolbarButtons.length; i++) {
            const toolbarButton = allToolbarButtons[i];
            $(toolbarButton).prop('disabled', false);

            const index = disabledToolButtons.indexOf($(toolbarButton).attr('id'));
            if (index !== -1) {
                $(toolbarButton).prop('disabled', true);
            }
        }
    }
});
