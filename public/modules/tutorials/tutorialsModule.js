/**
 * Created by william on 13.08.15.
 */
var ccTutorials = angular.module('cc.tutorials', []);


/**
 * Config
 */
ccTutorials.config(['$stateProvider', function($stateProvider) {
    $stateProvider
        .state('albums', {
            url: '/albums',
            templateUrl: '/modules/tutorials/albums.html',
            controller: 'AlbumsController',
            resolve: {
                albums: ['$stateParams', function($stateParams) {
                    return [
                        {
                            author: { name: '王尼玛' },
                            introduction: '清华大学教授孙行者的最新著作, 全面而详细的介绍了如何从零开始, 使用现有的web框架, 开发新的web项目, 老少皆宜, 实乃居家旅行必备良书.',
                            name: 'Web开发指南',
                            type: 'Web'
                        },
                        {
                            introduction: '逗知识, 冷吐槽, 这个家伙很无聊; 装装逼, 扯扯蛋, 标题内容反着看.',
                            name: 'We Do Code Right',
                            type: 'Other'
                        },
                        {
                            introduction: '数据库技术是非常重要的, 很多应用都离不开他, 跟我学, 121, 我们都爱肯德基!',
                            name: 'Database 2015',
                            type: 'Database'
                        },
                        {
                            introduction: 'Java 是一门编程艺术, 讲究的是说学逗唱. 但在众多编程语言当中, Java算是较难的一只, 有很多复杂的语法和规则, 但同时提供了很多便利和安全性服务, 大家可以放心的使用它.',
                            name: 'Java Advance',
                            type: 'Language'
                        },
                        {
                            introduction: 'Python 很火唉最近, 想不想试试?',
                            name: 'Learn Python from 0',
                            type: 'Language'
                        },
                        {
                            introduction: '中南大学的计算机科学专业很不错哦, 大家可以试试, 但信息安全专业更棒!',
                            name: 'Computer Science',
                            type: 'Other'
                        }
                    ];
                }]
            }
        })
}]);


/**
 * Controllers
 */
ccTutorials.controller('AlbumsController', ['$scope', '$state', '$stateParams', '$compile', '$window', '$document', '$timeout', 'underscore', 'albums', function($scope, $state, $stateParams, $compile, $window, $document, $timeout, underscore, albums) {
    $scope.albums = angular.copy(albums);
    $scope.filteredAlbums = angular.copy(albums);
    $scope.searchOptions = {
        type: 'All'
    };


    // Interactions
    _closePreview = function() {
        angular.element('.album-preview').remove();
    };
    _resetAlbumsTop = function() {
        angular.forEach(angular.element('.album'), function(item) {
            var currentItem = angular.element(item);
            currentItem.css('top', 0);
        });
    };
    _setAlbumsTop = function(offsetTop, top) {
        angular.forEach(angular.element('.album'), function(item) {
            var currentItem = angular.element(item);
            if(currentItem.prop('offsetTop') > offsetTop) {
                currentItem.css('top', top);
            }
        });
    };
    _getPreviewOffset = function(selectedOffset) {
        var offset = angular.copy(selectedOffset);
        // set left
        angular.forEach(angular.element('.album'), function(item) {
            var currentItem = angular.element(item);
            if(currentItem.prop('offsetLeft') < offset.left) {
                offset.left = currentItem.prop('offsetLeft');
            }
        })
        // set top
        offset.top = offset.top + 250;
        return offset;
    };
    _openPreview = function(offset, album, albumIndex) {
        var previewElement = angular.element('<div class="album-preview" close="closePreview()" album="getAlbum(' + albumIndex +  ')"></div>');
        var listDiv = angular.element('.album-list');
        $compile(previewElement)($scope);
        listDiv.append(previewElement);
        previewElement.offset( offset );
        previewElement.height(290);
    };
    _resetAll = function(previousElement) {
        if(previousElement.length) {
            _closePreview();
            _resetAlbumsTop();
            previousElement.removeClass('selected');
            var pageElement = angular.element('.page-container');
            pageElement.css('height','auto');
        }
    };
    _showPreview = function(element, previousElement, sameElement, album, albumIndex) {
        // 1. check if clicking on the same album again
        // 1.1 if yes, do nothing here, since preview is closed and all albums are reset
        // 1.2 if no, move down all albums bellow the selected element and open another preview
        if(!sameElement) {
            // update offset of selected element
            var selectedOffset = { left: element.prop('offsetLeft'), top: element.prop('offsetTop')};
            _setAlbumsTop(selectedOffset.top, 310);
            var previewOffset = _getPreviewOffset(selectedOffset);
            // addjust previewOffset because of the animation
            if(element.prop('offsetTop') > previousElement.prop('offsetTop')) {
                previewOffset.top -= 310;
            }
            _openPreview(previewOffset, album, albumIndex);
        }

        // 2. update element class 'selected'
        if(sameElement) {
            element.removeClass('selected');
        } else {
            element.addClass('selected');
        }

        // 3. update page container heiht
        var pageElement = angular.element('.page-container');
        pageElement.css('height','auto');
        var pageHeight = parseInt(pageElement.height());
        if(previousElement.length === 0) {
            pageElement.height(pageHeight + 310);
        } else if(!sameElement) {
            pageElement.height(pageHeight + 310);
        }
    };
    _updateAlbumsAndPreview = function(element, album, albumIndex) {
        if(element.length) {
            var previousElement = angular.element('.album.selected');
            var sameElement = previousElement.length && element.hasClass('selected');

            // 1. check if any preview is open, close it if yes
            _resetAll(previousElement);
            // 2. mode albums and show preview
            _showPreview(element, previousElement, sameElement, album, albumIndex);
        }
    };
    $scope.togglePreview = function(album, index) {
        var element = angular.element('.album').eq(index);
        _updateAlbumsAndPreview(element, album, index);
    };
    $scope.closePreview = function() {
        var previousElement = angular.element('.album.selected');
        _resetAll(previousElement);
    };
    $scope.search = function(type) {
        $scope.closePreview();
        if(type) {
            if(type === 'All') {
                $scope.filteredAlbums = angular.copy($scope.albums);
            } else {
                $scope.filteredAlbums = underscore.filter($scope.albums, function(item) {
                    return item.type === type;
                });
            }
            $scope.searchOptions.type = type;
        } else {
            $timeout.cancel($scope.searchOptions.timeout);
            if($scope.searchOptions.query.trim().length > 0) {
                $scope.searchOptions.timeout = $timeout(function () {
                    // todo: call server for query
                }, 1000);
            } else {
                $scope.searchOptions.results = [];
            }
        }
    };
    $scope.getAlbum = function(index) {
        return angular.copy($scope.albums[index]);
    };


    // Events
    var w = angular.element($window);
    $scope.getWindowDimensions = function () {
        return w.width();
    };
    $scope.$watch($scope.getWindowDimensions, function (newValue, oldValue) {
        if(!angular.equals(newValue, oldValue)) {
            if(Math.abs(newValue - oldValue) > 18) {
                var element = angular.element('.album.selected');
                if(element.length) {
                    _updateAlbumsAndPreview(element);
                }
            }

        }
    }, true);

    w.bind('resize', function () {
        $scope.$apply();
    });
}]);