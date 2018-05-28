var async = require('async');
var _ = require('lodash');
var logger = require('../../lib/logger.lib');
var siteInfoService = require('../services/site-info.service');
var categoriesService = require('../services/categories.service');
var listsService = require('../services/lists.service');

/**
 * 栏目
 * @param {Object} req
 *        {String} req.query.page
 * @param {Object} res
 * @param {Function} next
 */
module.exports = function (req, res, next) {
    req.checkQuery({
        'page': {
            optional: true,
            isInt: {errorMessage: 'page 需为 mongoId'}
        }
    });

    if (req.validationErrors()) {
        logger.system().error(__filename, '参数验证失败', req.validationErrors());
        return res.status(400).end();
    }

    categoriesService.one({
        path: '/' + req.params.column + req.params[0],
        type: 'column'
    }, function (err, category) {
        if (err) return res.status(500).end();

        if (!category) return next();

        async.parallel({
            siteInfo: siteInfoService.get,
            navigation: function (callback) {
                categoriesService.navigation({current: category.path}, callback);
            },
            list: function (callback) {
                var query = {
                    _id: category._id
                };

                if (_.get(category, 'mixed.pageSize')) query.pageSize = category.mixed.pageSize;
                if (req.query.page) query.currentPage = parseInt(req.query.page);

                listsService.column(query, function (err, result) {
                    if (err) return callback(err);

                    if (_.get(result, 'pagination.length') <= 1) {
                        delete result.pagination
                        return callback(null, result);
                    }

                    var pagination = _.map(result.pagination, function (page) {
                        if (page.index === 1) {
                            page.url = category.path;
                        } else {
                            page.url = category.path + '?page=' + page.index;
                        }

                        delete page.index;
                        return page;
                    });

                    result.pagination = pagination;

                    callback(null, result);
                });
            },
            localReadingTotal: function (callback) {
                listsService.reading({_id: category._id}, callback);
            },
            localReadingDay: function (callback) {
                listsService.reading({_id: category._id, sort: '-reading.day'}, callback);
            },
            localReadingWeek: function (callback) {
                listsService.reading({_id: category._id, sort: '-reading.week'}, callback);
            },
            localReadingMonth: function (callback) {
                listsService.reading({_id: category._id, sort: '-reading.month'}, callback);
            }
        }, function (err, results) {
            if (err) return res.status(500).end();
            var list = {};
            var newList = {};
            var materialItemList = {};
            var tagArr = [];
            var tagNameObj = {
                '官方新闻': 'a',
                '媒体报道': 'b',
                '行业资讯': 'c',
                '品牌宣传': 'd',
                '成分技术': 'e',
                '价格功效': 'f',
                '代理招募': 'g'
            };

            // 将日期对象转为符合要求的字符串格式  '201805'
            function dateToSrc(date) {
                return date.toLocaleDateString().split('-')[0] + (date.toLocaleDateString().split('-')[1].length < 2? '0'+date.toLocaleDateString().split('-')[1] : date.toLocaleDateString().split('-')[1])
            }

            var contents = results.list.contents;
            if (category.path === '/news') {
                // 获取标签种类
                contents.forEach(function (e) {
                    !(tagArr.indexOf(e.tags[0]) > -1) && e.tags[0] ? tagArr.push(tagNameObj[e.tags[0]]) : '';
                });

                // 将所有数据按标签分类
                tagArr.forEach(function (ae) {
                    list[ae] = [];
                    contents.forEach(function (e) {
                        if(tagNameObj[e.tags[0]] === ae){
                            list[ae].push(e);
                        }
                    })
                });

                // 封装为3个一组的二维数组
                tagArr.forEach(function (ae) {
                    newList[ae] = [];
                    var result = [];
                    for(var i=0,len=list[ae].length;i<len;i+=3){
                        result.push(list[ae].slice(i,i+3));
                    }
                    newList[ae] = result;
                });
            }else if (category.path === '/material') {
                // 获取标签种类
                contents.forEach(function (e) {
                    !(tagArr.indexOf(e.tags[0]) > -1) && e.tags[0] ? tagArr.push(tagNameObj[e.tags[0]]) : '';
                    e.imgSrc = '/media/' + dateToSrc(e.date) + '/' + e.media[0]._id + '/' + e.media[0].fileName;
                });

                // 将所有数据按标签分类
                tagArr.forEach(function (ae) {
                    list[ae] = [];
                    materialItemList[ae] = [];
                    contents.forEach(function (e) {
                        if(tagNameObj[e.tags[0]] === ae){
                            list[ae].push(e);
                            materialItemList[ae].push(e);
                        }
                    })
                });

                // 封装为12个一组的二维数组
                tagArr.forEach(function (ae) {
                    newList[ae] = [];
                    var result = [];
                    for(var i=0,len=list[ae].length;i<len;i+=12){
                        result.push(list[ae].slice(i,i+12));
                    }
                    newList[ae] = result;
                });
            }else if (category.path === '/about') {
                // 添加图片路径
                contents.forEach(function (e) {
                   e.imgSrc = '/media/' + dateToSrc(e.date) + '/' + e.media[0]._id + '/' + e.media[0].fileName;
                });
                // 封装为6个一组的二维数组
                var result = [];
                for(var i=0,len=contents.length;i<len;i+=6){
                    result.push(contents.slice(i,i+6));
                }
                newList = result;
            }
            console.log('materialItemList= ',materialItemList)
            res.render(_.get(category, 'views.column'), {
                layout: _.get(category, 'views.layout'),
                siteInfo: results.siteInfo,
                navigation: results.navigation,
                category: category,
                list: newList === {} ? results.list : newList,
                materialItemList: materialItemList,
                readingList: {
                    total: results.localReadingTotal,
                    day: results.localReadingDay,
                    week: results.localReadingWeek,
                    month: results.localReadingMonth
                }
            });
        });
    });
};