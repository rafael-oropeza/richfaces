/*
 * JBoss, Home of Professional Open Source
 * Copyright 2013, Red Hat, Inc. and individual contributors
 * by the @authors tag. See the copyright.txt in the distribution for a
 * full listing of individual contributors.
 *
 * This is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation; either version 2.1 of
 * the License, or (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this software; if not, write to the Free
 * Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301 USA, or see the FSF site: http://www.fsf.org.
 */

(function (richfaces) {

    richfaces.Selection = richfaces.Selection || {};

    richfaces.Selection.set = function (field, start, end) {
        if (field.setSelectionRange) {
            field.focus();
            field.setSelectionRange(start, end);
        } else if (field.createTextRange) {
            var range = field.createTextRange();
            range.collapse(true);
            range.moveEnd('character', end);
            range.moveStart('character', start);
            range.select();
        }
    }

    richfaces.Selection.getStart = function(field) {
        if (field.setSelectionRange) {
            return field.selectionStart;
        } else if (document.selection && document.selection.createRange) {
            var r = document.selection.createRange().duplicate();
            r.moveEnd('character', field.value.length);
            if (r.text == '') return field.value.length;
            return field.value.lastIndexOf(r.text);
        }
    }

    richfaces.Selection.getEnd = function(field) {
        if (field.setSelectionRange) {
            return field.selectionEnd;
        } else if (document.selection && document.selection.createRange) {
            var r = document.selection.createRange().duplicate();
            r.moveStart('character', -field.value.length);
            return r.text.length;
        }
    }

    richfaces.Selection.setCaretTo = function (field, pos) {
        if (!pos) pos = field.value.length;
        richfaces.Selection.set(field, pos, pos);
    }
})(window.RichFaces || (window.RichFaces = {}));