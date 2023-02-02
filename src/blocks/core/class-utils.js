/**
 * Functions to manipulate classNames
 */

export function hasClass( className, testClass ) {
	if (!className) return false;
	return new RegExp('(\\s|^)' + testClass + '(\\s|$)').test(className);
}

export function toggleClass( className, classToToggle ) {
	className = className?.trim();
	if (!className) return classToToggle;
	const regex = new RegExp('(^|\\s+)' + classToToggle + '(\\s+|$)');
	className = regex.test(className)
		? className.replace(regex, '')
		: (className + ' ' + classToToggle);
	return className === '' ? undefined : className;
}

export function replaceClasses( className, classesToRemove, newClass ) {
	className = className?.trim();
	if (!className) {
		className = newClass; // newClass can be empty so don't return here
	} else {
		// don't use single (class1|class2) regex as that won't match both classes
		// with (^|\\s)
		for (var i = classesToRemove.length - 1; i >= 0; i--) {
			className = className.replace(
				new RegExp('(^|\\s+)' + classesToRemove[i] + '(\\s+|$)'), '');
		}
		if (newClass && !hasClass(className, newClass)) {
			if (!!className) className += ' ';
			className += newClass;
		}
	}
	return className === '' ? undefined : className;
}
